import React, { FC } from "react";
import { Stack, Flex, Box, Text, Link, Button } from "@chakra-ui/react";

const Layout: FC = ({ children }) => {
    return (
        <Stack h="100vh">
            <Flex bg="purple.200" p={4} justifyContent="space-around" alignItems="center">
                <Box>
                    <Text fontWeight="bold">Hyo-Animals</Text>    
                </Box>    
                <Link to="/">
                    <Button size="sm" colorScheme="blue">Main</Button>
                </Link>
                <Link to="my-animal">
                    <Button size="sm" colorScheme="red">My Animal</Button>
                </Link>
            </Flex>
            <Flex direction="column" h="full" justifyContent="center" alignItems="center">
                {children}
            </Flex>
        </Stack>
    );
};

export default Layout;