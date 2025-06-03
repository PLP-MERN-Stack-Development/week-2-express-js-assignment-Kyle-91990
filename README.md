[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=19672352&assignment_repo_type=AssignmentRepo)
# Express.js Product API

## Setup Instructions
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and configure your environment variables
3. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

### Products
- `GET /api/products` - List all products
  - Query params: category, page, limit, search
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/stats/categories` - Get product statistics

### Authentication
All requests require an `x-api-key` header with your API key.

### Example Request
```bash
curl -X GET http://localhost:3000/api/products \
  -H "x-api-key: your-api-key"
```