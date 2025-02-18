import {
  Box,
  HoverCardRoot,
  HoverCardTrigger,
  Flex,
  HoverCardContent,
  Button,
  Text,
  useSnackbar,
} from "@livepeer/design-system";
import { CopyIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

const KeyCell = ({ token }) => {
  const [openSnackbar] = useSnackbar();
  const [keyRevealed, setKeyRevealed] = useState(false);

  return (
    <Box>
      {keyRevealed ? (
        <HoverCardRoot openDelay={200}>
          <HoverCardTrigger>
            <Flex css={{ height: 25, ai: "center" }}>
              <CopyToClipboard
                text={token.id}
                onCopy={() => openSnackbar("Copied to clipboard")}>
                <Box
                  css={{
                    fontFamily: "monospace",
                    cursor: "pointer",
                    fontSize: "$1",
                  }}>
                  {token.id}
                </Box>
              </CopyToClipboard>
            </Flex>
          </HoverCardTrigger>
          <HoverCardContent>
            <Text
              variant="gray"
              css={{
                backgroundColor: "$panel",
                borderRadius: 6,
                px: "$3",
                py: "$1",
                fontSize: "$1",
                display: "flex",
                ai: "center",
              }}>
              <CopyIcon /> <Box css={{ ml: "$2" }}>Click to copy</Box>
            </Text>
          </HoverCardContent>
        </HoverCardRoot>
      ) : (
        <Button size="1" type="button" onClick={() => setKeyRevealed(true)}>
          Reveal key
        </Button>
      )}
    </Box>
  );
};

export default KeyCell;
