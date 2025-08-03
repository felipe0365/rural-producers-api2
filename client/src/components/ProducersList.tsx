import { useEffect, useState } from 'react'
import { Table, Input, Button, Space, message, Popconfirm, Tag } from 'antd'
import { SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import {
  getProducers,
  deleteProducer,
  type Producer,
  type PaginationDto,
  type FilterProducerDto,
} from '../services/api.services'

const { Search } = Input

const ProducersList: React.FC = () => {
  const navigate = useNavigate()
  const [producers, setProducers] = useState<Producer[]>([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState<PaginationDto>({ page: 1, limit: 10 })
  const [filters, setFilters] = useState<FilterProducerDto>({})
  const [total, setTotal] = useState(0)

  const fetchProducers = async () => {
    try {
      setLoading(true)
      const response = await getProducers(pagination, filters)
      setProducers(response.data)
      setTotal(response.total)
    } catch (error) {
      message.error('Erro ao carregar produtores')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducers()
  }, [pagination, filters])

  const handleSearch = (value: string) => {
    setFilters({ ...filters, producerName: value })
    setPagination({ ...pagination, page: 1 })
  }

  const handleDelete = async (id: string) => {
    try {
      console.log('Tentando excluir produtor com ID:', id)
      await deleteProducer(id)
      console.log('Produtor excluído com sucesso')
      message.success('Produtor excluído com sucesso')
      fetchProducers()
    } catch (error: any) {
      console.error('Erro ao excluir produtor:', error)
      console.error('Detalhes do erro:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      })
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao excluir produtor'
      message.error(errorMessage)
    }
  }

  const columns = [
    {
      title: 'Documento',
      dataIndex: 'document',
      key: 'document',
      render: (document: string, record: Producer) => (
        <div>
          <div>{document}</div>
          <Tag color={record.documentType === 'CPF' ? 'blue' : 'green'}>{record.documentType}</Tag>
        </div>
      ),
    },
    {
      title: 'Nome do Produtor',
      dataIndex: 'producerName',
      key: 'producerName',
    },
    {
      title: 'Nº de Fazendas',
      dataIndex: 'farms',
      key: 'farms',
      render: (farms: any[]) => farms?.length || 0,
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_: any, record: Producer) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/produtores/detalhes/${record.id}`)}
            title="Visualizar"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => navigate(`/produtores/editar/${record.id}`)}
            title="Editar"
          />
          <Popconfirm
            title="Excluir produtor"
            description="Tem certeza que deseja excluir este produtor? Esta ação não pode ser desfeita."
            onConfirm={() => handleDelete(record.id)}
            okText="Sim"
            cancelText="Não"
          >
            <Button type="text" danger icon={<DeleteOutlined />} title="Excluir" />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h1>Produtores Rurais</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/produtores/novo')}>
          Adicionar Produtor
        </Button>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <Search
          placeholder="Buscar por nome do produtor"
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          onSearch={handleSearch}
          style={{ maxWidth: '400px' }}
        />
      </div>

      <Table
        columns={columns}
        dataSource={producers}
        rowKey="id"
        loading={loading}
        pagination={{
          current: pagination.page,
          pageSize: pagination.limit,
          total: total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} itens`,
          onChange: (page, pageSize) => {
            setPagination({ page, limit: pageSize || 10 })
          },
        }}
      />
    </div>
  )
}

export default ProducersList
