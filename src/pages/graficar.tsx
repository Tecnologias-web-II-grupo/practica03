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
  const provinciaPorSexoData = location.state?.provinciaPorSexoData ?? null;

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

  // Preparar datos para gráfico de barras (provincia por sexo)
  const barData: any[] | null = provinciaPorSexoData && provinciaPorSexoData.length > 0
    ? [
        ['Provincia - Sexo', 'Cantidad'],
        ...provinciaPorSexoData.map((row: any) => [
          `${row.provincia} (${row.sexo})`,
          row.cantidad
        ])
      ]
    : null;

  const optionsBar = {
    title: 'Distribución por Provincia y Sexo Biológico',
    hAxis: { title: 'Cantidad de Individuos', titleTextStyle: { color: 'black' } },
    vAxis: { title: 'Provincia - Sexo', titleTextStyle: { color: 'black' } },
    backgroundColor: '#f5f5f5',
    legend: { position: 'bottom' as const },
    chartArea: { width: '60%', height: '80%' }
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

        {/* Gráfica - Estado Civil */}
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

        {/* Gráfica - Provincia por Sexo */}
        {barData && (
          <div className="row justify-content-center mb-5">
            <div className="col-md-12 card p-3 shadow-sm" style={{ backgroundColor: '#fff8e1' }}>
              <h5 className="text-center mb-3">Distribución por Provincia y Sexo Biológico</h5>
              <Chart
                chartType="BarChart"
                width="100%"
                height="500px"
                data={barData}
                options={optionsBar}
              />
              
              {/* Tabla de datos detrás del gráfico */}
              <div className="mt-5">
                <h6>Detalle de Datos: Distribución por Provincia y Sexo Biológico</h6>
                <table className="table table-striped table-bordered table-sm">
                  <thead className="table-warning">
                    <tr>
                      <th>Provincia</th>
                      <th>Sexo Biológico</th>
                      <th>Cantidad</th>
                      <th>Porcentaje por Provincia</th>
                    </tr>
                  </thead>
                  <tbody>
                    {provinciaPorSexoData.map((row: any, i: number) => (
                      <tr key={i}>
                        <td>{row.provincia}</td>
                        <td>{row.sexo}</td>
                        <td>{row.cantidad}</td>
                        <td>{row.porcentaje}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default GraficaVotos;