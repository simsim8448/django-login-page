from django.shortcuts import render,redirect
from django.contrib.auth import authenticate, login
from django.contrib import messages
from django.contrib.auth.decorators import login_required


def login_view(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")

        user = authenticate(
            request,
            username=username,
            password=password
        )

        if user is not None:
            login(request, user)
            return redirect("accounts:dashboard")
        else:
            messages.error(
                request,
                "نام کاربری یا رمز عبور اشتباه است."
            )

    return render(request, "accounts/login.html")


@login_required
def dashboard(request):
    return render(request, "accounts/dashboard.html")

# Create your views here.

