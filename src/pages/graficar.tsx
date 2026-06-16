
		import { Chart } from 'react-google-charts';
		import { intencionVotosData } from '../data/votosData';

		const options = {
			title: 'INTENCIÓN DE VOTOS',
			hAxis: {
				title: 'MESES',
				titleTextStyle: { color: 'green' }
			},
			vAxis: {
				title: 'Encuestados',
				titleTextStyle: { color: '#FF0000' }
			},
			backgroundColor: '#ffffcc',
			legend: {
				position: 'bottom' as const,
				textStyle: { color: 'blue', fontSize: 13 }
			},
		};

		const GraficaVotos = () => {
			return (
				<div className="app-container">
					<header className="bg-dark text-white p-3 text-center mb-4">
						<h1>Estadística Universitaria</h1>
					</header>
					<main>
						<div className="container mt-4">
							<div className="row justify-content-center">
								<div className="col-md-10 card p-3 shadow-sm" style={{ backgroundColor: '#ffffcc' }}>
									{/* Componente nativo de React Google Charts */}
									<Chart
										chartType="ColumnChart"
										width="100%"
										height="500px"
										data={intencionVotosData}
										options={options}
									/>
								</div>
							</div>
						</div>
					</main>
				</div>
			);
		};

		export default GraficaVotos;
