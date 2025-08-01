#!/bin/bash

echo "🚀 Iniciando Rural Producers API - Stack Completo"
echo "=================================================="

# Verificar se o Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Por favor, inicie o Docker primeiro."
    exit 1
fi

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker-compose down

# Remover volumes antigos (opcional - descomente se quiser limpar dados)
# echo "🧹 Removendo volumes antigos..."
# docker-compose down -v

# Construir e iniciar containers
echo "🔨 Construindo e iniciando containers..."
docker-compose up --build -d

# Aguardar inicialização
echo "⏳ Aguardando inicialização dos serviços..."
sleep 10

# Verificar status
echo "📊 Status dos containers:"
docker-compose ps

echo ""
echo "✅ Stack iniciado com sucesso!"
echo ""
echo "🌐 URLs de acesso:"
echo "   Frontend:     http://localhost:5173"
echo "   Backend API:  http://localhost:3000"
echo "   PgAdmin:      http://localhost:5050"
echo "   Database:     localhost:5432"
echo ""
echo "📝 Credenciais PgAdmin:"
echo "   Email:    admin@admin.com"
echo "   Password: 123"
echo ""
echo "🛠️  Comandos úteis:"
echo "   Ver logs:     docker-compose logs -f"
echo "   Parar:        docker-compose down"
echo "   Reiniciar:    docker-compose restart"