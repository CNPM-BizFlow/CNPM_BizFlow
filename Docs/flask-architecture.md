# Architecture
```bash
bizflow
├── migrations/                 
├── scripts/
│   └── run_postgres.sh         
│
├── frontend/
│   ├── pubic/
│   │   └──........ 
│   └── src/
│   │   └──........ 
│   │   
├── src/
│   ├── api/                    
│   │   ├── controllers/         
│   │   │   └──.......... 
│   │   ├── schemas/
│   │   │   └──..........
│   │   │
│   ├── domain/            
│   │   ├── models/
│   │   │   └── .........
│   │   │ 
│   ├── infastructure/
│   │   │   ├── database/
│   │   │   │   └── ...........
│   │   │   ├── models/
│   │   │   │   └── ...........
│   │   │   ├── repositories
│   │   │   │   └── ...........
│   │   │   └── services/
│   │   │       └── ...........
│   │   │ 
│   │   ├── scripts/
│   │   ├── service/
│   │   └── test/
│   │
│   ├── check_ids.py
│   ├── debug_customer.py
│   ├── debug_owner.py
│   ├── inspect_colummns.py
│   ├── list_data.py
│   ├── list_tables.py
│   └── verify_stores.py
│
└── README.md
```
## Domain Layer

## Services Layer

## Infrastructure Layer

## ORM Đã được triển khai trong Flask python 
Ánh xạ các class python --> Table CSDL 
