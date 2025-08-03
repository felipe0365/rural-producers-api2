import { useEffect, useState } from 'react'
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Row,
  Col,
  InputNumber,
  Space,
  Divider,
  message,
  Spin,
  Collapse,
  Typography,
} from 'antd'
import { PlusOutlined, DeleteOutlined, SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createProducer, updateProducer, getProducer, brazilianStates, commonCultures } from '../services/api.services'

const { Option } = Select
const { Panel } = Collapse
const { Title, Text } = Typography

const farmSchema = z
  .object({
    farmName: z.string().min(1, 'Nome da fazenda é obrigatório'),
    city: z.string().min(1, 'Cidade é obrigatória'),
    state: z.string().min(1, 'Estado é obrigatório'),
    totalArea: z.number().min(0.01, 'Área total deve ser maior que 0'),
    arableArea: z.number().min(0, 'Área agricultável deve ser maior ou igual a 0'),
    vegetationArea: z.number().min(0, 'Área de vegetação deve ser maior ou igual a 0'),
    plantedCrops: z.array(
      z.object({
        harvest: z.string().min(1, 'Safra é obrigatória'),
        cultures: z.array(z.string()).min(1, 'Selecione pelo menos uma cultura'),
        plantedAreas: z
          .array(z.number().min(0.01, 'Área plantada deve ser maior que 0'))
          .min(1, 'Defina área para cada cultura'),
      }),
    ),
  })
  .refine(
    (data) => {
      return data.arableArea + data.vegetationArea <= data.totalArea
    },
    {
      message: 'A soma das áreas agricultável e vegetação não pode ultrapassar a área total',
      path: ['arableArea'],
    },
  )

const producerSchema = z.object({
  document: z.string().min(1, 'Documento é obrigatório'),
  documentType: z.enum(['CPF', 'CNPJ']),
  producerName: z.string().min(1, 'Nome do produtor é obrigatório'),
  farms: z.array(farmSchema).min(1, 'Pelo menos uma fazenda é obrigatória'),
})

type ProducerFormData = z.infer<typeof producerSchema>

const ProducerForm: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(false)

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
    reset,
  } = useForm<ProducerFormData>({
    resolver: zodResolver(producerSchema),
    defaultValues: {
      document: '',
      documentType: 'CPF',
      producerName: '',
      farms: [
        {
          farmName: '',
          city: '',
          state: '',
          totalArea: 0,
          arableArea: 0,
          vegetationArea: 0,
          plantedCrops: [
            {
              harvest: '',
              cultures: [],
              plantedAreas: [],
            },
          ],
        },
      ],
    },
  })

  const farms = watch('farms')

  useEffect(() => {
    if (id) {
      loadProducer()
    }
  }, [id])

  const loadProducer = async () => {
    try {
      setInitialLoading(true)
      const producer = await getProducer(id!)
      reset({
        document: producer.document,
        documentType: producer.documentType,
        producerName: producer.producerName,
        farms: producer.farms.map((farm) => ({
          farmName: farm.farmName,
          city: farm.city,
          state: farm.state,
          totalArea: farm.totalArea,
          arableArea: farm.arableArea,
          vegetationArea: farm.vegetationArea,
          plantedCrops: farm.plantedCrops.map((crop) => ({
            harvest: crop.harvest,
            cultures: crop.cultures,
            plantedAreas: crop.plantedAreas,
          })),
        })),
      })
    } catch (error) {
      message.error('Erro ao carregar dados do produtor')
      navigate('/produtores')
    } finally {
      setInitialLoading(false)
    }
  }

  const onSubmit = async (data: ProducerFormData) => {
    try {
      setLoading(true)
      if (id) {
        await updateProducer(id, data)
        message.success('Produtor atualizado com sucesso')
      } else {
        await createProducer(data)
        message.success('Produtor criado com sucesso')
      }
      navigate('/produtores')
    } catch (error) {
      message.error('Erro ao salvar produtor')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const addFarm = () => {
    const currentFarms = watch('farms')
    setValue('farms', [
      ...currentFarms,
      {
        farmName: '',
        city: '',
        state: '',
        totalArea: 0,
        arableArea: 0,
        vegetationArea: 0,
        plantedCrops: [
          {
            harvest: '',
            cultures: [],
            plantedAreas: [],
          },
        ],
      },
    ])
  }

  const removeFarm = (index: number) => {
    const currentFarms = watch('farms')
    setValue(
      'farms',
      currentFarms.filter((_, i) => i !== index),
    )
  }

  const addPlantedCrop = (farmIndex: number) => {
    const currentFarms = watch('farms')
    const updatedFarms = [...currentFarms]
    updatedFarms[farmIndex].plantedCrops.push({
      harvest: '',
      cultures: [],
      plantedAreas: [],
    })
    setValue('farms', updatedFarms)
  }

  const removePlantedCrop = (farmIndex: number, cropIndex: number) => {
    const currentFarms = watch('farms')
    const updatedFarms = [...currentFarms]
    updatedFarms[farmIndex].plantedCrops.splice(cropIndex, 1)
    setValue('farms', updatedFarms)
  }

  const validateAreaSum = (farmIndex: number) => {
    const farm = farms[farmIndex]
    if (!farm) return true
    return farm.arableArea + farm.vegetationArea <= farm.totalArea
  }

  if (initialLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <p style={{ marginTop: '16px' }}>Carregando dados do produtor...</p>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Title level={2}>{id ? 'Editar Produtor' : 'Novo Produtor'}</Title>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/produtores')}>
          Voltar
        </Button>
      </div>

      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        {/* Dados do Produtor */}
        <Card title="Dados do Produtor" style={{ marginBottom: '24px' }}>
          <Row gutter={16}>
            <Col span={12}>
              <Controller
                name="documentType"
                control={control}
                render={({ field }) => (
                  <Form.Item label="Tipo de Documento" validateStatus={errors.documentType ? 'error' : ''}>
                    <Select {...field}>
                      <Option value="CPF">CPF</Option>
                      <Option value="CNPJ">CNPJ</Option>
                    </Select>
                  </Form.Item>
                )}
              />
            </Col>
            <Col span={12}>
              <Controller
                name="document"
                control={control}
                render={({ field }) => (
                  <Form.Item label="Documento" validateStatus={errors.document ? 'error' : ''}>
                    <Input {...field} placeholder="Digite o documento" />
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
          <Controller
            name="producerName"
            control={control}
            render={({ field }) => (
              <Form.Item label="Nome do Produtor" validateStatus={errors.producerName ? 'error' : ''}>
                <Input {...field} placeholder="Digite o nome do produtor" />
              </Form.Item>
            )}
          />
        </Card>

        {/* Fazendas */}
        <Card title="Fazendas e Propriedades" style={{ marginBottom: '24px' }}>
          {farms.map((farm, farmIndex) => (
            <Collapse key={farmIndex} style={{ marginBottom: '16px' }}>
              <Panel header={`Fazenda ${farmIndex + 1}`} key={farmIndex}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Controller
                      name={`farms.${farmIndex}.farmName`}
                      control={control}
                      render={({ field }) => (
                        <Form.Item
                          label="Nome da Fazenda"
                          validateStatus={errors.farms?.[farmIndex]?.farmName ? 'error' : ''}
                        >
                          <Input {...field} placeholder="Nome da fazenda" />
                        </Form.Item>
                      )}
                    />
                  </Col>
                  <Col span={6}>
                    <Controller
                      name={`farms.${farmIndex}.city`}
                      control={control}
                      render={({ field }) => (
                        <Form.Item label="Cidade" validateStatus={errors.farms?.[farmIndex]?.city ? 'error' : ''}>
                          <Input {...field} placeholder="Cidade" />
                        </Form.Item>
                      )}
                    />
                  </Col>
                  <Col span={6}>
                    <Controller
                      name={`farms.${farmIndex}.state`}
                      control={control}
                      render={({ field }) => (
                        <Form.Item label="Estado" validateStatus={errors.farms?.[farmIndex]?.state ? 'error' : ''}>
                          <Select {...field} placeholder="Selecione o estado">
                            {brazilianStates.map((state) => (
                              <Option key={state.value} value={state.value}>
                                {state.label}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      )}
                    />
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={8}>
                    <Controller
                      name={`farms.${farmIndex}.totalArea`}
                      control={control}
                      render={({ field }) => (
                        <Form.Item
                          label="Área Total (ha)"
                          validateStatus={errors.farms?.[farmIndex]?.totalArea ? 'error' : ''}
                        >
                          <InputNumber {...field} min={0} style={{ width: '100%' }} />
                        </Form.Item>
                      )}
                    />
                  </Col>
                  <Col span={8}>
                    <Controller
                      name={`farms.${farmIndex}.arableArea`}
                      control={control}
                      render={({ field }) => (
                        <Form.Item
                          label="Área Agricultável (ha)"
                          validateStatus={
                            errors.farms?.[farmIndex]?.arableArea || !validateAreaSum(farmIndex) ? 'error' : ''
                          }
                        >
                          <InputNumber {...field} min={0} style={{ width: '100%' }} />
                        </Form.Item>
                      )}
                    />
                  </Col>
                  <Col span={8}>
                    <Controller
                      name={`farms.${farmIndex}.vegetationArea`}
                      control={control}
                      render={({ field }) => (
                        <Form.Item
                          label="Área de Vegetação (ha)"
                          validateStatus={errors.farms?.[farmIndex]?.vegetationArea ? 'error' : ''}
                        >
                          <InputNumber {...field} min={0} style={{ width: '100%' }} />
                        </Form.Item>
                      )}
                    />
                  </Col>
                </Row>

                {!validateAreaSum(farmIndex) && (
                  <Text type="danger">
                    A soma das áreas agricultável e vegetação não pode ultrapassar a área total da fazenda.
                  </Text>
                )}

                <Divider />

                {/* Culturas Plantadas */}
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '16px',
                    }}
                  >
                    <Title level={4}>Culturas Plantadas</Title>
                    <Button type="dashed" icon={<PlusOutlined />} onClick={() => addPlantedCrop(farmIndex)}>
                      Adicionar Cultura
                    </Button>
                  </div>

                  {farm.plantedCrops.map((_, cropIndex) => (
                    <Card key={cropIndex} size="small" style={{ marginBottom: '8px' }}>
                      <Row gutter={16}>
                        <Col span={8}>
                          <Controller
                            name={`farms.${farmIndex}.plantedCrops.${cropIndex}.harvest`}
                            control={control}
                            render={({ field }) => (
                              <Form.Item
                                label="Safra"
                                validateStatus={
                                  errors.farms?.[farmIndex]?.plantedCrops?.[cropIndex]?.harvest ? 'error' : ''
                                }
                              >
                                <Input {...field} placeholder="Ex: Safra 2024" />
                              </Form.Item>
                            )}
                          />
                        </Col>
                        <Col span={12}>
                          <Controller
                            name={`farms.${farmIndex}.plantedCrops.${cropIndex}.cultures`}
                            control={control}
                            render={({ field }) => (
                              <Form.Item
                                label="Culturas"
                                validateStatus={
                                  errors.farms?.[farmIndex]?.plantedCrops?.[cropIndex]?.cultures ? 'error' : ''
                                }
                              >
                                <Select
                                  {...field}
                                  mode="multiple"
                                  placeholder="Selecione as culturas"
                                  style={{ width: '100%' }}
                                  onChange={(values) => {
                                    field.onChange(values)
                                    // Atualizar áreas plantadas quando culturas mudam
                                    const currentAreas = farms[farmIndex].plantedCrops[cropIndex].plantedAreas || []
                                    const newAreas = values.map((_, index) => currentAreas[index] || 0)
                                    setValue(`farms.${farmIndex}.plantedCrops.${cropIndex}.plantedAreas`, newAreas)
                                  }}
                                >
                                  {commonCultures.map((culture) => (
                                    <Option key={culture} value={culture}>
                                      {culture}
                                    </Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            )}
                          />
                        </Col>
                        <Col span={4}>
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => removePlantedCrop(farmIndex, cropIndex)}
                            style={{ marginTop: '32px' }}
                          />
                        </Col>
                      </Row>

                      {/* Áreas plantadas para cada cultura */}
                      {farm.plantedCrops[cropIndex]?.cultures?.length > 0 && (
                        <Row gutter={16} style={{ marginTop: '16px' }}>
                          <Col span={24}>
                            <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>Áreas Plantadas (ha):</div>
                            <Row gutter={8}>
                              {farm.plantedCrops[cropIndex].cultures.map((culture, cultureIndex) => (
                                <Col span={8} key={cultureIndex}>
                                  <Controller
                                    name={`farms.${farmIndex}.plantedCrops.${cropIndex}.plantedAreas.${cultureIndex}`}
                                    control={control}
                                    render={({ field }) => (
                                      <Form.Item
                                        label={culture}
                                        validateStatus={
                                          errors.farms?.[farmIndex]?.plantedCrops?.[cropIndex]?.plantedAreas?.[
                                            cultureIndex
                                          ]
                                            ? 'error'
                                            : ''
                                        }
                                      >
                                        <InputNumber
                                          {...field}
                                          min={0.01}
                                          placeholder="Área (ha)"
                                          style={{ width: '100%' }}
                                        />
                                      </Form.Item>
                                    )}
                                  />
                                </Col>
                              ))}
                            </Row>
                          </Col>
                        </Row>
                      )}
                    </Card>
                  ))}
                </div>

                {farms.length > 1 && (
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => removeFarm(farmIndex)}
                    style={{ marginTop: '16px' }}
                  >
                    Remover Fazenda
                  </Button>
                )}
              </Panel>
            </Collapse>
          ))}

          <Button type="dashed" icon={<PlusOutlined />} onClick={addFarm} block>
            Adicionar Outra Fazenda
          </Button>
        </Card>

        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button onClick={() => navigate('/produtores')}>Cancelar</Button>
            <Button type="primary" htmlType="submit" loading={loading} disabled={!isValid} icon={<SaveOutlined />}>
              {id ? 'Atualizar' : 'Salvar'} Produtor
            </Button>
          </Space>
        </div>
      </Form>
    </div>
  )
}

export default ProducerForm
