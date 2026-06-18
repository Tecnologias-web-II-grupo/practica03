import { Chart } from 'react-google-charts';
import { intencionVotosData } from '../data/votosData';
import { useLocation } from 'react-router-dom';

const optionsVotos = {
  title: 'INTENCIÓN DE VOTOS',
  hAxis: { title: 'MESES', titleTextStyle: { color: 'green' } },
  vAxis: { title: 'Encuestados', titleTextStyle: { color: '#FF0000' } },
  backgroundColor: '#ffffcc',
  legend: { position: 'bottom' as const, textStyle: { color: 'blue', fontSize: 13 } },
};

const GraficaVotos = () => {
  const location = useLocation();
  const estadoCivilData = location.state?.estadoCivilData ?? null;
  const pieData: any[] | null = estadoCivilData
    ? [
        ['Estado Civil', 'Cantidad'],
        ...estadoCivilData.map((row: any) => [row.estado, row.cantidad])
      ]
    : null;

  const optionsPie = {
    title: 'Distribución por Estado Civil',
    is3D: true,
    backgroundColor: '#f0f8ff',
    legend: { position: 'bottom' as const },
  };

  return (
    <div className="app-container">
      <header className="bg-dark text-white p-3 text-center mb-4">
        <h1>Estadística Universitaria</h1>
      </header>

      <main className="container mt-4">
        {/* Gráfica original - Intención de votos */}
        <div className="row justify-content-center mb-5">
          <div className="col-md-10 card p-3 shadow-sm" style={{ backgroundColor: '#ffffcc' }}>
            <h5 className="text-center mb-3">Intención de Votos por Mes</h5>
            <Chart
              chartType="ColumnChart"
              width="100%"
              height="400px"
              data={intencionVotosData}
              options={optionsVotos}
            />
          </div>
        </div>

        {/* Gráfica nueva - Estado Civil */}
        {pieData && (
          <div className="row justify-content-center mb-5">
            <div className="col-md-10 card p-3 shadow-sm" style={{ backgroundColor: '#f0f8ff' }}>
              <h5 className="text-center mb-3">Distribución por Estado Civil</h5>
              <Chart
                chartType="PieChart"
                width="100%"
                height="400px"
                data={pieData}
                options={optionsPie}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default GraficaVotos;