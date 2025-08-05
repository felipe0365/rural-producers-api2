import { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Spin, Alert, Typography } from "antd";
import {
    HomeOutlined,
    EnvironmentOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { getDashboardData, type DashboardData } from "../services/api.services";
import PieChartCard from "./PieChartCard";

const { Title } = Typography;

const Dashboard: React.FC = () => {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(
        null
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const data = await getDashboardData();
                setDashboardData(data);
            } catch (err) {
                setError(
                    "Falha ao buscar os dados do dashboard. Verifique se a API está rodando."
                );
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                <Spin size="large" />
                <p style={{ marginTop: "16px" }}>
                    Carregando dados do dashboard...
                </p>
            </div>
        );
    }

    if (error || !dashboardData) {
        return (
            <Alert
                message="Erro"
                description={error || "Não foi possível carregar os dados."}
                type="error"
                showIcon
            />
        );
    }

    return (
        <div>
            <Title level={2} style={{ color: "#2e7d32", marginBottom: "24px" }}>
                🌾 Dashboard Agrícola
            </Title>

            <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
                <Col xs={24} sm={8}>
                    <Card
                        className="stat-card"
                        style={{ borderLeft: "4px solid #4caf50" }}
                    >
                        <Statistic
                            title="🏡 Total de Fazendas"
                            value={dashboardData.totalFarms}
                            prefix={
                                <HomeOutlined style={{ color: "#4caf50" }} />
                            }
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card
                        className="stat-card"
                        style={{ borderLeft: "4px solid #8bc34a" }}
                    >
                        <Statistic
                            title="🌍 Área Total (ha)"
                            value={dashboardData.totalArea}
                            precision={2}
                            prefix={
                                <EnvironmentOutlined
                                    style={{ color: "#8bc34a" }}
                                />
                            }
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card
                        className="stat-card"
                        style={{ borderLeft: "4px solid #66bb6a" }}
                    >
                        <Statistic
                            title="👨‍🌾 Total de Produtores"
                            value={dashboardData.totalProducers}
                            prefix={
                                <UserOutlined style={{ color: "#66bb6a" }} />
                            }
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24} lg={8}>
                    <PieChartCard
                        title="Fazendas por Estado"
                        data={dashboardData.byState}
                        emptyMessage="Nenhuma fazenda cadastrada por estado"
                    />
                </Col>
                <Col xs={24} lg={8}>
                    <PieChartCard
                        title="Culturas por Área Plantada"
                        data={dashboardData.byCulture}
                        emptyMessage="Nenhuma cultura plantada cadastrada"
                    />
                </Col>
                <Col xs={24} lg={8}>
                    <PieChartCard
                        title="Uso do Solo"
                        data={[
                            {
                                name: "Área Agricultável",
                                value: dashboardData.byLandUse.arableArea,
                            },
                            {
                                name: "Área de Vegetação",
                                value: dashboardData.byLandUse.vegetationArea,
                            },
                        ]}
                        emptyMessage="Nenhuma área cadastrada"
                    />
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
