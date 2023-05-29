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
import { apiConnection } from "../services/apiConnection";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

export default function SignIn() {
  // eslint-disable-next-line no-unused-vars
  const [cookies, setCookie, removeCookie] = useCookies([
    "token",
    "credentials",
    "userData",
  ]);
  const toast = useToast();
  const navigate = useNavigate();

  const signInSchema = yup.object().shape({
    name: yup.string().required("Nome é obrigatório."),
    surname: yup.string(),
    email: yup.string().required("E-mail é obrigatório."),
    password: yup.string().required("Senha é obrigatória."),
    role: yup.array().default(["ADMIN"]),
    confirmPassword: yup.string().required("Repita a senha novamente."),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(signInSchema),
  });

  const onValid = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast({
        title: "Erro ao alterar a senha.",
        description: "As senhas não se coincidem.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    delete data.confirmPassword;

    try {
      await apiConnection.post("/users", {
        ...data,
      });

      removeCookie("token");
      removeCookie("userData");
      removeCookie("credentials");

      toast({
        title: "Cadastro realizado com sucesso.",
        description: "Faça login para continuar.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      navigate("/login");
    } catch (error) {
      console.error("Erro ao cadastrar usuário", error);
      
      let errorMessage = "Tente novamente mais tarde.";
      if (error.response.data?.erro) {
        errorMessage = error.response.data?.erro;
      }

      toast({
        title: "Erro ao cadastrar usuário.",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const onInvalid = (data) => {
    for (const key in data) {
      toast({
        title: "Erro ao cadastrar usuário.",
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
        <Text>Preencha o formulário para realizar o cadastro</Text>
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
          <Text fontSize={"12px"}>Nome:</Text>
          <Input
            type="text"
            mt={"3px"}
            placeholder="Digite o seu nome"
            {...register("name")}
            isInvalid={errors.name}
          />

          <Text mt={"20px"} fontSize={"12px"}>
            Sobrenome:
          </Text>
          <Input
            type="text"
            mt={"3px"}
            placeholder="Digite o seu sobrenome"
            {...register("surname")}
            isInvalid={errors.surname}
          />

          <Text mt={"20px"} fontSize={"12px"}>
            E-mail:
          </Text>
          <Input
            type="email"
            mt={"3px"}
            placeholder="Digite o seu email"
            {...register("email")}
            isInvalid={errors.email}
          />

          <Text mt={"20px"} fontSize={"12px"}>
            Senha:
          </Text>
          <Input
            type="password"
            placeholder="Digite a sua senha"
            mt={"3px"}
            {...register("password")}
            isInvalid={errors.password}
          />

          <Text mt={"20px"} fontSize={"12px"}>
            Confirme a senha:
          </Text>
          <Input
            type="password"
            placeholder="Confirme a sua senha"
            mt={"3px"}
            {...register("confirmPassword")}
            isInvalid={errors.confirmPassword}
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
