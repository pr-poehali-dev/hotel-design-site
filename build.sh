#!/bin/bash
# Скрипт сборки для Vercel

echo "📦 Установка зависимостей..."
npm install

echo "🔨 Сборка проекта..."
npm run build

echo "✅ Сборка завершена! Папка dist готова к публикации."
