/* eslint-disable consistent-return */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Table,
  Button,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  makeStyles,
  Typography,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import AlertDialog from '../../../components/dialogo';
import getInitials from '../../../utils/getInitials';
import { TokenContext } from '../../../lib/context/contextToken';
import { DeleteVacunaPacient } from '../../../api/vacunas';

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const statusVacunas = (status) => {
  switch (status) {
    case 'Pendiente':
      return 'warning';
    case 'Completado':
      return 'success';
    case 'Retrasado':
      return 'error';
    default: 'info';
  }
};

const TableMisVacunas = ({ vacunas, setActualizarCalendario }) => {
  const { token } = useContext(TokenContext);
  const [dialogo, setDialogo] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [IdVacuna, setIdVacuna] = useState('');
  const classes = useStyles();

  useEffect(() => {
    IdVacuna && isDelete && setLoading(true);

    try {
      const deleteVacuna = async () => {
        await DeleteVacunaPacient(token, IdVacuna);
        setActualizarCalendario(true);
        setLoading(false);
      };

      IdVacuna && isDelete && deleteVacuna();
    } catch (error) {
      console.log(error.message);
      setLoading(false);
    }
  }, [IdVacuna, isDelete]);

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              Mascota
            </TableCell>
            <TableCell>
              Email Dueño
            </TableCell>
            <TableCell>
              Doctor
            </TableCell>
            <TableCell>
              Vacuna
            </TableCell>
            <TableCell>
              Fecha para vacuna
            </TableCell>
            <TableCell>
              Cantidad
            </TableCell>
            <TableCell>
              Realizado el
            </TableCell>
            <TableCell>
              Estado
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {vacunas.map((vacuna) => (
            <TableRow
              hover
              key={vacuna.id_vacuna}
            >
              <TableCell>
                <Box
                  alignItems="center"
                  display="flex"
                >
                  <Avatar
                    className={classes.avatar}
                    src={vacuna.avatar}
                  >
                    {getInitials(vacuna.nombre_paciente)}
                  </Avatar>
                  <Typography
                    color="textPrimary"
                    variant="body1"
                  >
                    {vacuna.nombre_paciente}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                {vacuna.emailPerson || 'Sin Dueño'}
              </TableCell>
              <TableCell>
                {vacuna.doctor || 'Sin Doctor'}
              </TableCell>
              <TableCell>
                <strong>{vacuna.nombre}</strong>
              </TableCell>
              <TableCell>
                {vacuna.edad}
              </TableCell>
              <TableCell>
                {vacuna.count}
              </TableCell>
              <TableCell>
                {vacuna.created_at ? vacuna.created_at : 'Sin fecha'}
              </TableCell>
              <TableCell>
                <Alert severity={statusVacunas(vacuna.isVacuna)}>{vacuna.isVacuna}</Alert>
              </TableCell>
              <TableCell>
                {vacuna.id_vacunas_pacient && (
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => {
                      setDialogo(true);
                      setIdVacuna(vacuna.id_vacunas_pacient);
                    }}
                  >
                    {loading ? 'Cargando...' : 'ELiminar'}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog visible={dialogo} setVisible={setDialogo} setIsDelete={setIsDelete}>
        <p>Estas seguro que quieres eliminar este registro?, uns vez echo sera irrecuperable.</p>
      </AlertDialog>
    </>
  );
};

export default TableMisVacunas;
