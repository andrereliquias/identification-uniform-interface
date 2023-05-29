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
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const { setIsAuthenticated } = useAuth();

  // eslint-disable-next-line no-unused-vars
  const [cookies, setCookie, removeCookie] = useCookies([
    "token",
    "credentials",
    "userData",
  ]);
  const toast = useToast();
  const navigate = useNavigate();

  const loginSchema = yup.object().shape({
    email: yup.string().required("E-mail é obrigatório."),
    password: yup.string().required("Senha é obrigatória."),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onValid = async (info) => {
    try {
      const { data } = await apiConnection.post("/login", info);

      setCookie("token", data.token, {
        path: "/",
      });
      setCookie("userData", data.user, {
        path: "/",
      });

      setCookie("credentials", data, {
        path: "/",
      });

      setIsAuthenticated(true);
      navigate("/identifier");
    } catch (error) {
      console.error("Erro ao realizar login", error);

      if (error?.response?.status === 404) {
        toast({
          title: "Erro ao fazer login.",
          description: "Usuário nao encontrado.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else if (error?.response?.status === 403) {
        toast({
          title: "Erro ao fazer login.",
          description: "Senha incorreta.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Erro ao fazer login.",
          description: "Tente novamente mais tarde.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const onInvalid = (data) => {
    for (const key in data) {
      toast({
        title: "Erro ao fazer login.",
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
        <Text>Olá, realize o seu login abaixo</Text>
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
          <Text fontSize={"12px"}>E-mail:</Text>
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

          <Button type="submit" w="100%" mt={"20px"} fontSize="13px">
            {isSubmitting ? (
              <>
                <Spinner />{" "}
              </>
            ) : (
              "Logar"
            )}
          </Button>
          <Button
            w="100%"
            mt={"5px"}
            fontSize="13px"
            onClick={() => navigate("/forgot-password")}
          >
            Esqueci a senha
          </Button>
          <Button
            w="100%"
            mt={"5px"}
            fontSize="13px"
            onClick={() => navigate("/signin")}
          >
            Cadastrar
          </Button>
        </form>
      </Flex>
    </Box>
  );
}
