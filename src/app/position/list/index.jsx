import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/nav/Navbar";
import { usePosition } from "../../helpers/usePosition";
import { apiConnection } from "../../services/apiConnection";

export default function ListPosition() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);
  const [deleteRef, setDeleteRef] = useState();
  const [tableData, setTableData] = useState([]);
  const cancelRef = React.useRef();

  // eslint-disable-next-line no-unused-vars
  const [cookies, setCookie, removeCookie] = useCookies([
    "token",
    "credentials",
    "userData",
    "company",
  ]);

  const { data, refetch } = usePosition(cookies.company.id, cookies.token);

  useEffect(() => {
    if (!!data) {
      setTableData(data);
    } else {
      setTableData([]);
    }
  }, [data]);

  const handleEdit = (id) => {
    navigate(`/position?id=${id}`);
  };

  const handlePlot = (id) => {
    navigate(`/position/plot?id=${id}`);
  };

  const handleDelete = (id) => {
    setIsOpen(true);
    setDeleteRef(id);
  };

  const onClose = () => {
    setIsOpen(false);
    refetch();
  };

  const handleConfirmDelete = () => {
    async function deleteItem() {
      try {
        await apiConnection.delete(`/positions/${deleteRef}`, {
          headers: {
            Authorization: cookies.token,
          },
        });

        onClose();
      } catch (error) {
        console.error("Erro na exclusao", error);
      } finally {
        setDeleteRef(null);
      }
    }

    if (!!deleteRef) {
      deleteItem();
    }
  };

  return (
    <Box minH={"100vh"} minW="100vh">
      <NavBar />

      <Box mt={"100px"}>
        <Table variant="simple" maxW={"500px"} margin={"auto"}>
          <Thead>
            <Tr>
              <Th>Nome</Th>
              <Th>Editar</Th>
              <Th>Excluir</Th>
              <Th textAlign={"center"}>Exibir gráfico</Th>
            </Tr>
          </Thead>
          <Tbody>
            {tableData.map((item) => (
              <Tr key={item.id}>
                <Td>{item.name}</Td>
                <Td>
                  <Button
                    colorScheme="teal"
                    onClick={() => handleEdit(item.id)}
                  >
                    Editar
                  </Button>
                </Td>
                <Td>
                  <Button
                    colorScheme="red"
                    onClick={() => handleDelete(item.id)}
                  >
                    Excluir
                  </Button>
                </Td>
                <Td>
                  <Button
                    colorScheme="gray"
                    onClick={() => handlePlot(item.id)}
                  >
                    Gráfico
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Excluir Item
              </AlertDialogHeader>

              <AlertDialogBody>
                Tem certeza de que deseja excluir este item?
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancelar
                </Button>
                <Button colorScheme="red" onClick={handleConfirmDelete} ml={3}>
                  Excluir
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Box>
    </Box>
  );
}
