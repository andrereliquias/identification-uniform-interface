import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import InputMask from "react-input-mask";
import axios from "axios";
import { useState } from "react";
import { apiConnection } from "../services/apiConnection";
import { useCookies } from "react-cookie";

export default function RegisterCompany({ data, setFirstAccess, refetch }) {
  // eslint-disable-next-line no-unused-vars
  const [cookies, setCookie, removeCookie] = useCookies([
    "token",
    "credentials",
    "userData",
  ]);

  const toast = useToast();

  const [disableAddress, setDisableAddress] = useState(false);

  const companySchema = yup.object().shape({
    fantasyName: yup.string().required("Nome fantasia é obrigatório."),
    cnpj: yup.string().required("CNPJ é obrigatório."),
    address: yup.object().shape({
      street: yup.string().required("Rua é obrigatório."),
      district: yup.string().required("Bairro é obrigatório."),
      city: yup.string().required("Cidade é obrigatório."),
      state: yup.string().required("Estado é obrigatório."),
      cep: yup.string().required("CEP é obrigatório."),
    }),
    phone: yup.string().required("Telefone é obrigatório."),
  });

  const {
    register,
    handleSubmit,
    setValue,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(companySchema),
  });

  const handleCEP = async (e) => {
    const value = e.target.value;

    if (value.match(/[0-9]{5}-[0-9]{3}/)) {
      try {
        const responseCep = await axios.get(
          `https://viacep.com.br/ws/${value.replace(/-/, "")}/json`
        );

        setValue("address.street", responseCep.data.logradouro);
        setValue("address.district", responseCep.data.bairro);
        setValue("address.city", responseCep.data.localidade);
        setValue("address.state", responseCep.data.uf);
        setDisableAddress(true);
        return;
      } catch (error) {
        console.error("erro ao solicitar CEP", error);
      }
    } else if (value.match(/_____-___/)) {
      resetField("address.street");
      resetField("address.district");
      resetField("address.city");
      resetField("address.state");
    }
    setDisableAddress(false);
  };

  const onValid = async (object) => {
    object.cnpj = object.cnpj.replace(/\D/g, "");
    object.phone = object.phone.replace(/\D/g, "");

    try {
      const responseCompany = await apiConnection.post("/companies", object, {
        headers: {
          Authorization: cookies.token,
        },
      });

      const userId = data.user.id;

      delete data.user.createdAt;
      delete data.user.id;
      delete data.user.table;

      const updatedUserData = {
        ...data.user,
        companyId: responseCompany.data.id,
        firstAccess: false,
      };

      await apiConnection.put(`/users/${userId}`, updatedUserData, {
        headers: {
          Authorization: cookies.token,
        },
      });

      toast({
        title: "Cadastro da empresa com sucesso.",
        description: "Agora você pode utilizar o sistema a vontade.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      refetch();
      setFirstAccess(false);
    } catch (error) {
      console.error("Erro ao cadastrar empresa", error);
      toast({
        title: "Erro ao cadastrar empresa.",
        description: "Tente novamente mais tarde.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const onInvalid = (data) => {
    for (const key in data) {
      toast({
        title: "Erro ao cadastrar empresa.",
        description: data[key].message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box minH={"100vh"} minW="100vh">
      <Heading
        fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
        textAlign="center"
        paddingTop={"5rem"}
      >
        <Text>Realize o cadastro da sua empresa!</Text>
      </Heading>

      <Flex
        mt={"70px"}
        flexDir={"column"}
        alignItems={"center"}
        w="100%"
        h="100%"
      >
        <form
          onSubmit={handleSubmit(onValid, onInvalid)}
          style={{
            width: "45%",
          }}
        >
          <Text fontSize={"12px"}>Nome fantasia:</Text>
          <Input
            type="text"
            mt={"3px"}
            placeholder="Digite o nome fantasia"
            {...register("fantasyName")}
            isInvalid={errors.fantasyName}
          />

          <Text mt={"20px"} fontSize={"12px"}>
            CNPJ:
          </Text>
          <Input
            type="text"
            mt={"3px"}
            placeholder="Digite o CNPJ"
            {...register("cnpj")}
            isInvalid={errors.cnpj}
            as={InputMask}
            mask="99.999.999/9999-99"
          />

          <Text mt={"20px"} fontSize={"12px"}>
            CEP:
          </Text>
          <Input
            type="text"
            mt={"3px"}
            placeholder="Digite o CEP"
            {...register("address.cep")}
            isInvalid={errors.cep}
            as={InputMask}
            mask="99999-999"
            onChange={(e) => handleCEP(e)}
          />

          <Text mt={"20px"} fontSize={"12px"}>
            Rua:
          </Text>
          <Input
            type="text"
            placeholder="Digite a sua rua"
            mt={"3px"}
            {...register("address.street")}
            isInvalid={errors.street}
            disabled={disableAddress}
          />

          <Text mt={"20px"} fontSize={"12px"}>
            Bairro:
          </Text>
          <Input
            type="text"
            placeholder="Digite o seu bairro"
            mt={"3px"}
            {...register("address.district")}
            isInvalid={errors.district}
            disabled={disableAddress}
          />

          <Text mt={"20px"} fontSize={"12px"}>
            Cidade:
          </Text>
          <Input
            type="text"
            placeholder="Digite a sua cidade"
            mt={"3px"}
            {...register("address.city")}
            isInvalid={errors.city}
            disabled={disableAddress}
          />

          <Text mt={"20px"} fontSize={"12px"}>
            Estado:
          </Text>
          <Input
            type="text"
            placeholder="Digite o seu estado"
            mt={"3px"}
            {...register("address.state")}
            isInvalid={errors.state}
            disabled={disableAddress}
          />

          <Text mt={"20px"} fontSize={"12px"}>
            Telefone:
          </Text>
          <Input
            type="tel"
            placeholder="Digite telefone"
            mt={"3px"}
            {...register("phone")}
            isInvalid={errors.phone}
            as={InputMask}
            mask="(99) 9999-9999"
          />

          <Button type="submit" w="100%" mt={"20px"} fontSize="13px">
            {isSubmitting ? (
              <>
                <Spinner />{" "}
              </>
            ) : (
              "Criar cadastro"
            )}
          </Button>
        </form>
      </Flex>
    </Box>
  );
}
