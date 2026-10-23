from django.urls import path
from . import views

urlpatterns = [
    # Авторизация
    path('auth/register/', views.register_user),
    path('auth/login/', views.login_user),

    # Товары и категории
    path('categories/', views.category_list),
    path('products/', views.product_list_or_create),
    path('products/<int:pk>/', views.product_detail),

    # Панель заказов (продавец / клиент)
    path('orders/', views.order_list_or_create),

    # Панель пользователей (только админ)
    path('users/', views.user_list_or_update),
    path('users/<int:pk>/', views.user_list_or_update),
]