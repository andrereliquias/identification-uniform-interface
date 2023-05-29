import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useDisclosure,
  Menu,
  MenuButton,
  Avatar,
  MenuList,
  Center,
  MenuDivider,
  MenuItem,
  Image,
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import icon from "../../assets/images/world_icon.svg";
import { useCookies } from "react-cookie";

export default function NavBar() {
  // eslint-disable-next-line no-unused-vars
  const [cookies, setCookie, removeCookie] = useCookies([
    "token",
    "credentials",
    "userData",
  ]);
  const { isOpen, onToggle } = useDisclosure();

  const handleLogout = () => {
    removeCookie("token");
    removeCookie("userData");
    removeCookie("credentials");

    window.location.href = "/login";
  };

  return (
    <Box>
      <Flex
        bg={useColorModeValue("white", "gray.800")}
        color={useColorModeValue("gray.600", "white")}
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.900")}
        align={"center"}
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
          <Image w="30px" h="30px" src={icon} />
          <Flex display={{ base: "none", md: "flex" }} ml={10}>
            <DesktopNav />
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={"flex-end"}
          direction={"row"}
          spacing={6}
        >
          <Menu>
            <MenuButton
              as={Button}
              rounded={"full"}
              variant={"link"}
              cursor={"pointer"}
              minW={0}
            >
              <Avatar
                size={"sm"}
                src={`https://api.dicebear.com/6.x/initials/svg?seed=${cookies.userData.name}`}
              />
            </MenuButton>
            <MenuList alignItems={"center"}>
              <br />
              <Center>
                <Avatar
                  size={"2xl"}
                  src={`https://api.dicebear.com/6.x/initials/svg?seed=${cookies.userData.name}`}
                />
              </Center>
              <br />
              <Center>
                <p>{cookies.userData?.name || "User"}</p>
              </Center>
              <br />
              <MenuDivider />
              <MenuItem opacity={"0.4"}>Configurações da sua conta</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
}

const DesktopNav = () => {
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const linkHoverColor = useColorModeValue("gray.800", "white");
  const popoverContentBgColor = useColorModeValue("white", "gray.800");

  return (
    <Stack direction={"row"} spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={"hover"} placement={"bottom-start"}>
            <PopoverTrigger>
              <Link
                p={2}
                href={navItem.href ?? "#"}
                fontSize={"sm"}
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: "none",
                  color: linkHoverColor,
                }}
              >
                {navItem.label}
              </Link>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={"xl"}
                bg={popoverContentBgColor}
                p={4}
                rounded={"xl"}
                minW={"sm"}
              >
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel, active }) => {
  return (
    <Link
      href={href}
      role={"group"}
      display={"block"}
      p={2}
      rounded={"md"}
      _hover={{ bg: useColorModeValue("gray.50", "gray.900") }}
      _disabled={!active}
      opacity={active ? "1" : "0.4"}
    >
      <Stack direction={"row"} align={"center"}>
        <Box>
          <Text
            transition={"all .3s ease"}
            _groupHover={{ color: "gray.400" }}
            fontWeight={500}
          >
            {label}
          </Text>
          <Text fontSize={"sm"}>{subLabel}</Text>
        </Box>
        <Flex
          transition={"all .3s ease"}
          transform={"translateX(-10px)"}
          opacity={0}
          _groupHover={{ opacity: "100%", transform: "translateX(0)" }}
          justify={"flex-end"}
          align={"center"}
          flex={1}
        >
          <Icon color={"gray.400"} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Link>
  );
};

const MobileNav = () => {
  return (
    <Stack
      bg={useColorModeValue("white", "gray.800")}
      p={4}
      display={{ md: "none" }}
    >
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={Link}
        href={href ?? "#"}
        justify={"space-between"}
        align={"center"}
        _hover={{
          textDecoration: "none",
        }}
      >
        <Text
          fontWeight={600}
          color={useColorModeValue("gray.600", "gray.200")}
        >
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={"all .25s ease-in-out"}
            transform={isOpen ? "rotate(180deg)" : ""}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: "0!important" }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={"solid"}
          borderColor={useColorModeValue("gray.200", "gray.700")}
          align={"start"}
        >
          {children &&
            children.map((child) => (
              <Link key={child.label} py={2} href={child.href}>
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

const NAV_ITEMS = [
  {
    label: "Minha empresa",
    children: [
      {
        label: "Editar",
        subLabel: "Edite os dados da sua empresa",
        href: "#",
        active: false,
      },
      {
        label: "Visualizar",
        subLabel: "Visualize os dados da sua empresa",
        href: "#",
        active: false,
      },
      {
        label: "Cadastrar novo ambiente",
        subLabel: "Cadastre novos ambientes",
        href: "#",
        active: false,
      },
    ],
  },
  {
    label: "Cargos",
    children: [
      {
        label: "Criar",
        subLabel: "Crie novos cargos para sua empresa",
        href: "/position",
        active: true,
      },
      {
        label: "Listar todos",
        subLabel: "Visualize o relatório, edite ou remova um cargo",
        href: "/position/list",
        active: true,
      },
    ],
  },
  {
    label: "Usuários",
    children: [
      {
        label: "Criar",
        subLabel: "Crie novos usuários para acessar a plataforma",
        href: "#",
        active: false,
      },
      {
        label: "Editar",
        subLabel: "Edite seus funcionários",
        href: "#",
        active: false,
      },
      {
        label: "Remover",
        subLabel: "Remova os funcionários",
        href: "#",
        active: false,
      },
    ],
  },
  {
    label: "Ambientes",
    children: [
      {
        label: "Camera principal",
        href: "/identifier",
        active: true,
      },
      {
        label: "Quarto 1",
        href: "#",
        active: false,
      },
      {
        label: "Quarto 2",
        href: "#",
        active: false,
      },
      {
        label: "Quarto 3",
        href: "#",
        active: false,
      },
    ],
  },
];
