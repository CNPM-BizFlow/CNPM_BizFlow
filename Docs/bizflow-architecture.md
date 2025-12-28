# Archỉtecture

bizflow
├── migrations/                 # migrate database
├── scripts/
│   └── run_postgres.sh         # chạy DB local
│
├── src/
│   ├── api/                    # tầng giao tiếp (REST API)
│   │   ├── controllers/        # nhận request từ FE
│   │   │   ├── order_controller.py
│   │   │   ├── product_controller.py
│   │   │   └── auth_controller.py
│   │   │
│   │   ├── schemas/            # validate request/response
│   │   │   ├── order_schema.py
│   │   │   └── product_schema.py
│   │   │
│   │   ├── middleware.py
│   │   ├── requests.py
│   │   └── responses.py
│   │
│   ├── domain/                 # TRÁI TIM NGHIỆP VỤ (ERD LOGIC)
│   │   ├── models/
│   │   │   ├── user.py         # Owner / Employee / Admin
│   │   │   ├── store.py
│   │   │   ├── product.py
│   │   │   ├── order.py
│   │   │   ├── customer.py
│   │   │   └── debt.py
│   │   │
│   │   ├── constants.py        # role, order_status
│   │   └── exceptions.py
│   │
│   ├── services/               # USE CASE (xử lý nghiệp vụ)
│   │   ├── create_order_service.py
│   │   ├── confirm_draft_order_service.py
│   │   ├── record_debt_service.py
│   │   └── report_service.py
│   │
│   ├── infrastructure/         # DB + ORM + service ngoài
│   │   ├── databases/
│   │   │   └── db.py           # init SQLAlchemy
│   │   │
│   │   ├── models/             # ORM MODELS (TABLE)
│   │   │   ├── user_model.py
│   │   │   ├── store_model.py
│   │   │   ├── product_model.py
│   │   │   ├── order_model.py
│   │   │   ├── order_item_model.py
│   │   │   └── customer_model.py
│   │   │
│   │   ├── repositories/       # cầu nối domain ↔ database
│   │   │   ├── order_repository.py
│   │   │   ├── product_repository.py
│   │   │   └── customer_repository.py
│   │   │
│   │   └── services/           # AI, email, notification
│   │       └── ai_service.py
│   │
│   ├── app.py
│   ├── create_app.py
│   ├── config.py
│   ├── dependency_container.py
│   ├── error_handler.py
│   └── logging.py
│
└── README.md
