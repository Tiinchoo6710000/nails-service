Backend (Flask + SQLite)
-----------------------

1) Crear y activar virtualenv:
   python -m venv venv
   # Windows PowerShell:
   venv\Scripts\Activate.ps1
   # mac/linux:
   source venv/bin/activate

2) Instalar dependencias:
   pip install -r requirements.txt

3) Inicializar DB:
   python db_init.py

4) Ejecutar:
   python app.py

Admin:
- Usuario/clave por defecto: admin / admin
- Recomendado: exportar ADMIN_USER y ADMIN_PASS en variables de entorno
