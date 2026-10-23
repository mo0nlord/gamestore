import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from proverka.models import Profile
from .models import Product, Category, Order, OrderItem


def product_to_dict(p):
    return {
        "id": p.id,
        "title": p.title,
        "description": p.description,
        "price": float(p.price),
        "stock": p.stock,
        "category_id": p.category_id,
        "category_name": p.category.name if p.category else None,
        "is_active": p.is_active,
    }


# --- 1. АВТОРИЗАЦИЯ И РЕГИСТРАЦИЯ ---

@csrf_exempt
def register_user(request):
    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)

    data = json.loads(request.body)
    username = data.get("username")
    email = data.get("email", "")
    password = data.get("password")
    role = data.get("role", "customer")

    if not username or not password:
        return JsonResponse({"error": "Логин и пароль обязательны"}, status=400)

    if User.objects.filter(username=username).exists():
        return JsonResponse({"error": "Пользователь с таким логином уже существует"}, status=400)

    user = User.objects.create_user(username=username, email=email, password=password)
    profile = Profile.objects.create(user=user, role=role)

    return JsonResponse({
        "message": "Регистрация успешна",
        "user": {"id": user.id, "username": user.username, "role": profile.role}
    }, status=201)


@csrf_exempt
def login_user(request):
    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)

    data = json.loads(request.body)
    username = data.get("username")
    password = data.get("password")

    user = authenticate(request, username=username, password=password)
    if user is None:
        return JsonResponse({"error": "Неверный логин или пароль"}, status=400)

    profile, _ = Profile.objects.get_or_create(
        user=user,
        defaults={'role': 'admin' if user.is_superuser else 'customer'}
    )
    role = 'admin' if user.is_superuser else profile.role

    return JsonResponse({
        "message": "Вход выполнен успешно",
        "user": {"id": user.id, "username": user.username, "role": role}
    })


# --- 2. УПРАВЛЕНИЕ ПОЛЬЗОВАТЕЛЯМИ (ТОЛЬКО ДЛЯ АДМИНА) ---

@csrf_exempt
def user_list_or_update(request, pk=None):
    if request.method == "GET":
        profiles = Profile.objects.select_related("user").all()
        data = [
            {
                "id": p.user.id,
                "username": p.user.username,
                "role": 'admin' if p.user.is_superuser else p.role,
            }
            for p in profiles
        ]
        return JsonResponse(data, safe=False)

    elif request.method == "PATCH" and pk:
        body = json.loads(request.body)
        new_role = body.get("role")
        profile = Profile.objects.get(user_id=pk)
        profile.role = new_role
        profile.save()
        return JsonResponse({"message": "Роль обновлена", "role": profile.role})

    return JsonResponse({"error": "Method not allowed"}, status=405)


# --- 3. ЗАКАЗЫ (ОФОРМЛЕНИЕ КЛИЕНТОМ / ПРОСМОТР ПРОДАВЦОМ) ---

@csrf_exempt
def order_list_or_create(request):
    if request.method == "GET":
        orders = Order.objects.prefetch_related('items__product').all().order_by('-created_at')
        data = []
        for o in orders:
            items = [
                {"title": item.product.title, "quantity": item.quantity, "price": float(item.price_at_order)}
                for item in o.items.all()
            ]
            data.append({
                "id": o.id,
                "customer_name": o.customer_name,
                "total_amount": float(o.total_amount),
                "status": o.status,
                "created_at": o.created_at.strftime("%d.%m.%Y %H:%M"),
                "items": items
            })
        return JsonResponse(data, safe=False)

    elif request.method == "POST":
        body = json.loads(request.body)
        order = Order.objects.create(
            customer_name=body.get("customer_name", "Клиент"),
            customer_email=body.get("customer_email", "test@test.ru"),
            total_amount=body.get("total_amount", 0),
            status="pending"
        )
        for item in body.get("items", []):
            OrderItem.objects.create(
                order=order,
                product_id=item["id"],
                quantity=item["count"],
                price_at_order=item["price"]
            )
        return JsonResponse({"message": "Заказ оформлен!", "order_id": order.id}, status=201)

    return JsonResponse({"error": "Method not allowed"}, status=405)


# --- 4. CRUD ТОВАРОВ И КАТЕГОРИИ ---

@csrf_exempt
def product_list_or_create(request):
    if request.method == "GET":
        products = Product.objects.all().select_related("category")
        return JsonResponse([product_to_dict(p) for p in products], safe=False)

    elif request.method == "POST":
        body = json.loads(request.body)
        category = Category.objects.get(id=body["category_id"])
        new_product = Product.objects.create(
            category=category,
            title=body["title"],
            description=body.get("description", ""),
            price=body["price"],
            stock=body.get("stock", 0),
            is_active=True,
        )
        return JsonResponse(product_to_dict(new_product), status=201)

    return JsonResponse({"error": "Method not allowed"}, status=405)


@csrf_exempt
def product_detail(request, pk):
    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return JsonResponse({"error": "Product not found"}, status=404)

    if request.method == "GET":
        return JsonResponse(product_to_dict(product))

    elif request.method == "PUT":
        body = json.loads(request.body)
        product.title = body.get("title", product.title)
        product.description = body.get("description", product.description)
        product.price = body.get("price", product.price)
        product.stock = body.get("stock", product.stock)
        if "category_id" in body:
            product.category_id = body["category_id"]
        product.save()
        return JsonResponse(product_to_dict(product))

    elif request.method == "DELETE":
        product.delete()
        return JsonResponse({"message": "Product deleted successfully"})

    return JsonResponse({"error": "Method not allowed"}, status=405)


def category_list(request):
    if request.method == "GET":
        cats = Category.objects.all()
        return JsonResponse([{"id": c.id, "name": c.name} for c in cats], safe=False)
    return JsonResponse({"error": "Method not allowed"}, status=405)