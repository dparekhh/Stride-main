[[workflows.workflow]]
name = "Start application"
description = "Starts the application with integrated health check server"
run = "gunicorn --bind 0.0.0.0:3000 --reuse-port --reload wsgi:app"