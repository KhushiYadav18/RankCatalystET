# Quick Fix for Migration Issues

## Problem
When running `python manage.py makemigrations`, you get an error about missing `openai` module.

## Solution

1. **Install missing package** (if not already installed):
   ```bash
   pip install openai
   ```

2. **Or install all requirements**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Create migrations**:
   ```bash
   python manage.py makemigrations
   ```

4. **Apply migrations**:
   ```bash
   python manage.py migrate
   ```

5. **Load questions**:
   ```bash
   python manage.py load_questions
   ```

## Why this happens
Django checks URL configuration during `makemigrations`, which imports views, which imports services that require the `openai` package.

