import { useForm } from 'react-hook-form';
import { Container, Grid, Paper, Typography } from '@mui/material';
import { usePapaParse } from 'react-papaparse';
import { useNavigate } from 'react-router-dom';

interface FormData {
  txtArchi: string[];
}

const App = () => {
  const parse: any = usePapaParse();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    const archivo: any = data.txtArchi[0];

    parse.readString(archivo, {
      delimiter: ';',
      header: false,
      dynamicTyping: true,
      complete: (result: any) => {
        console.log('Datos procesados:', result.data);
        navigate('/procesar', { state: { contenido: result.data } });
      },
    });
  };

  return (
    <Container maxWidth="sm" style={{ maxWidth: 'md', marginTop: '15px' }}>
      <Paper elevation={3} style={{ padding: '5px' }}>
        <Grid container spacing={2} style={{ padding: '5px' }}>
          <Typography variant="h5">Lectura de archivos csv</Typography>
          <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
            <Grid container spacing={2}>
              <Grid>
                <input
                  {...register('txtArchi', { required: true })}
                  type="file"
                  style={{ width: '100%', padding: '5px', fontSize: '13px' }}
                />
              </Grid>
              <Grid>
                <button type="submit" style={{ padding: '10px 15px', fontSize: '13px' }}>
                  Procesar
                </button>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Paper>
    </Container>
  );
};

export default App;