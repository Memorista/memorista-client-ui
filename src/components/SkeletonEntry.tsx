import { Box, Flex, SkeletonCircle, SkeletonText } from '@chakra-ui/react';

export const SkeletonEntry = () => (
  <Flex width="100%">
    <SkeletonCircle size="10" />
    <Box ml="3">
      <SkeletonText width="300px" noOfLines={2} />
    </Box>
  </Flex>
);
