import { Box, Flex, SkeletonCircle, SkeletonText } from '@chakra-ui/react';
import { VFC } from 'react';

export const SkeletonEntry: VFC = () => (
  <Flex width="100%">
    <SkeletonCircle size="10" />
    <Box ml="3">
      <SkeletonText width="300px" noOfLines={2} />
    </Box>
  </Flex>
);
