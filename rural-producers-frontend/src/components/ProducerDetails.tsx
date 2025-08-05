import React, { useEffect, useState } from 'react'
import { Card, Descriptions, Divider, Typography, Button, Spin, Alert } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { getProducer, type Producer } from '../services/api.services'
import dayjs from 'dayjs'

const { Title, Text } = Typography

const ProducerDetails: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [producer, setProducer] = useState<Producer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducer = async () => {
      if (!id) {
        setError('ID do produtor não fornecido')
        setLoading(false)
        return
      }

      try {
        const data = await getProducer(id)
        setProducer(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
      } finally {
        setLoading(false)
      }
    }

    fetchProducer()
  }, [id])

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <p style={{ marginTop: '16px' }}>Carregando dados do produtor...</p>
      </div>
    )
  }

  if (error) {
    return <Alert message="Erro ao carregar dados do produtor" description={error} type="error" showIcon />
  }

  if (!producer) {
    return <Alert message="Produtor não encontrado" type="warning" showIcon />
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Title level={2}>Detalhes do Produtor</Title>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/produtores')}>
          Voltar
        </Button>
      </div>

      <Card title="Dados do Produtor" style={{ marginBottom: '24px' }}>
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Nome">{producer.producerName}</Descriptions.Item>
          <Descriptions.Item label="Documento">{producer.document}</Descriptions.Item>
          <Descriptions.Item label="Tipo de Documento">{producer.documentType}</Descriptions.Item>
          <Descriptions.Item label="Criado em">
            {dayjs(producer.createdAt).format('DD/MM/YYYY HH:mm')}
          </Descriptions.Item>
          <Descriptions.Item label="Atualizado em">
            {dayjs(producer.updatedAt).format('DD/MM/YYYY HH:mm')}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {!producer.farms || producer.farms.length === 0 ? (
        <Alert message="Este produtor não possui fazendas cadastradas." type="info" showIcon />
      ) : (
        <>
          <Title level={3}>Fazendas</Title>
          {producer.farms.map((farm, idx) => (
            <Card key={farm.id || idx} title={`Fazenda ${idx + 1}: ${farm.farmName}`} style={{ marginBottom: '16px' }}>
              <Descriptions column={2} bordered>
                <Descriptions.Item label="Cidade">{farm.city}</Descriptions.Item>
                <Descriptions.Item label="Estado">{farm.state}</Descriptions.Item>
                <Descriptions.Item label="Área Total (ha)">{farm.totalArea}</Descriptions.Item>
                <Descriptions.Item label="Área Agricultável (ha)">{farm.arableArea}</Descriptions.Item>
                <Descriptions.Item label="Área de Vegetação (ha)">{farm.vegetationArea}</Descriptions.Item>
              </Descriptions>
              <Divider />
              <Title level={5}>Culturas Plantadas</Title>
              {farm.plantedCrops && farm.plantedCrops.length > 0 ? (
                farm.plantedCrops.map((crop, cropIdx) => (
                  <div key={crop.id || cropIdx} style={{ marginBottom: 8 }}>
                    <b>Safra:</b> {crop.harvest} <br />
                    <b>Culturas:</b> {crop.cultures && crop.cultures.length > 0 ? crop.cultures.join(', ') : 'Nenhuma'}
                  </div>
                ))
              ) : (
                <Text type="secondary">Nenhuma cultura cadastrada</Text>
              )}
            </Card>
          ))}
        </>
      )}
    </div>
  )
}

export default ProducerDetails
