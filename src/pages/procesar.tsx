import { useLocation, useNavigate } from 'react-router-dom';
import DataTable from "react-data-table-component";

// Detecta el tipo real del dato
const detectarTipo = (valor: any): string => {
  if (valor === null || valor === undefined || valor === '') return 'vacío';
  
  // Detectar fecha (formato dd/mm/yyyy o yyyy-mm-dd)
  const regexFecha = /^\d{2}\/\d{2}\/\d{4}$|^\d{4}-\d{2}-\d{2}$/;
  if (typeof valor === 'string' && regexFecha.test(valor.trim())) return 'date';
  
  if (typeof valor === 'string' && valor.trim().length === 1) return 'char';

  if (typeof valor === 'number') return 'number';
  
  return 'string';
};

// Calcula estadística de estado civil
const calcularEstadoCivil = (headers: string[], rows: any[][]): any[] => {
  // Buscar columna de estado civil (flexible)
  const colIndex = headers.findIndex((h: string) =>
    h.toLowerCase().includes('estado') || h.toLowerCase().includes('civil')
  );
  if (colIndex === -1) return [];

  const conteo: Record<string, number> = {};
  rows.forEach(row => {
    const val = String(row[colIndex] ?? '').trim();
    if (val) conteo[val] = (conteo[val] || 0) + 1;
  });

  const total = Object.values(conteo).reduce((a, b) => a + b, 0);
  return Object.entries(conteo).map(([estado, cantidad]) => ({
    estado,
    cantidad,
    porcentaje: ((cantidad / total) * 100).toFixed(2) + '%'
  }));
};

// Calcula estadística de provincia por sexo biológico
const calcularProvinciaPorSexo = (headers: string[], rows: any[][]): any[] => {
  const provinciaIndex = headers.findIndex((h: string) =>
    h.toLowerCase().includes('provincia')
  );
  const sexoIndex = headers.findIndex((h: string) =>
    h.toLowerCase().includes('sexo') || h.toLowerCase().includes('genero') || h.toLowerCase().includes('género')
  );

  if (provinciaIndex === -1 || sexoIndex === -1) return [];

  const conteo: Record<string, Record<string, number>> = {};
  
  rows.forEach(row => {
    const provincia = String(row[provinciaIndex] ?? '').trim();
    const sexo = String(row[sexoIndex] ?? '').trim();
    
    if (provincia && sexo) {
      if (!conteo[provincia]) {
        conteo[provincia] = {};
      }
      conteo[provincia][sexo] = (conteo[provincia][sexo] || 0) + 1;
    }
  });

  const resultado: any[] = [];
  Object.entries(conteo).forEach(([provincia, sexoData]) => {
    const totalProvincia = Object.values(sexoData).reduce((a: any, b: any) => a + b, 0);
    Object.entries(sexoData).forEach(([sexo, cantidad]: any) => {
      resultado.push({
        provincia,
        sexo,
        cantidad,
        porcentaje: ((cantidad / totalProvincia) * 100).toFixed(2) + '%'
      });
    });
  });

  return resultado;
};

const Procesar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const contenido = location.state?.contenido ?? null;

  if (!contenido || contenido.length < 2) {
    return <p className="p-4">No hay datos cargados. <button onClick={() => navigate('/')}>Volver</button></p>;
  }

  const headers: string[] = contenido[0];
  const rows: any[][] = contenido.slice(1);

  // Columnas para DataTable
  const columns = headers.map((item: string) => ({
    name: item,
    selector: (row: any) => row[item],
    sortable: true,
  }));

  // Filas para DataTable
  const data = rows.slice(0, 50).map((row: any[]) => {
    const obj: any = {};
    headers.forEach((h, i) => { obj[h] = row[i]; });
    return obj;
  });

  // Estadística estado civil
  const estadoCivilData = calcularEstadoCivil(headers, rows);

  // Estadística provincia por sexo
  const provinciaPorSexoData = calcularProvinciaPorSexo(headers, rows);

  const customStyle = {
    rows: { style: { minHeight: '50px' } },
    headCells: { style: { paddingLeft: '8px', paddingRight: '8px', fontSize: '14px' } },
    cells: { style: { paddingLeft: '8px', paddingRight: '8px', fontSize: '14px' } },
  };

  return (
    <div className="container mt-3">
      <h4>Contenido del archivo</h4>

      {/* Estructura de datos con tipos */}
      <h5 className="mt-3">Estructura de datos</h5>
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>{headers.map((item, i) => <th key={i}>{item}</th>)}</tr>
        </thead>
        <tbody>
          <tr>{rows[0].map((item, i) => <td key={i}>{detectarTipo(item)}</td>)}</tr>
        </tbody>
      </table>

      {/* DataTable */}
      <h5 className="mt-4">Conjunto de datos</h5>
      <DataTable
        columns={columns}
        data={data}
        pagination
        selectableRows
        customStyles={customStyle}
      />

      {/* Estadística estado civil */}
      <h5 className="mt-5"> Estadística: Distribución por Estado Civil</h5>
      {estadoCivilData.length > 0 ? (
        <>
          <table className="table table-striped table-bordered mt-2">
            <thead className="table-info">
              <tr>
                <th>Estado Civil</th>
                <th>Cantidad</th>
                <th>Porcentaje</th>
              </tr>
            </thead>
            <tbody>
              {estadoCivilData.map((row, i) => (
                <tr key={i}>
                  <td>{row.estado}</td>
                  <td>{row.cantidad}</td>
                  <td>{row.porcentaje}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Botón para ir a la gráfica */}
          <button
            className="btn btn-primary mt-2 mb-4"
            onClick={() => navigate('/graficar', {
              state: { estadoCivilData, contenido }
            })}
          >
            Ver Gráfica de Estado Civil
          </button>
        </>
      ) : (
        <p className="text-muted">No se encontró columna de estado civil en los datos.</p>
      )}

      {/* Estadística provincia por sexo */}
      <h5 className="mt-5">Estadística: Distribución por Provincia y Sexo</h5>
      {provinciaPorSexoData.length > 0 ? (
        <table className="table table-striped table-bordered mt-2">
          <thead className="table-warning">
            <tr>
              <th>Provincia</th>
              <th>Sexo Biológico</th>
              <th>Cantidad</th>
              <th>Porcentaje</th>
            </tr>
          </thead>
          <tbody>
            {provinciaPorSexoData.map((row, i) => (
              <tr key={i}>
                <td>{row.provincia}</td>
                <td>{row.sexo}</td>
                <td>{row.cantidad}</td>
                <td>{row.porcentaje}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-muted">No se encontraron columnas de provincia y/o sexo en los datos.</p>
      )}

      {/* Botón para ir a la gráfica de provincia por sexo */}
      {provinciaPorSexoData.length > 0 && (
        <button
          className="btn btn-warning mt-2 mb-4"
          onClick={() => navigate('/graficar', {
            state: { provinciaPorSexoData, contenido }
          })}
        >
          Ver Gráfica de Provincia y Sexo
        </button>
      )}
    </div>
  );
};

export default Procesar;