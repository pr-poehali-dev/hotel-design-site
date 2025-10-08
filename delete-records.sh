#!/bin/bash

# Script to delete test records from cleaning history API
API_URL="https://functions.poehali.dev/31057b18-39ce-40dd-8afe-75b9fa434a82"

echo "🚀 Starting deletion of test records..."
echo ""

# Delete record id=1
echo "Deleting test record with id=\"1\"..."
curl -X DELETE "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{"id":"1"}' \
  -w "\n"

echo ""

# Wait a moment
sleep 0.5

# Delete record id=3
echo "Deleting test record with id=\"3\"..."
curl -X DELETE "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{"id":"3"}' \
  -w "\n"

echo ""
echo "✨ Deletion process completed!"
echo "📋 Note: Record id=\"2\" (Савастеева Марина) was kept as requested."
