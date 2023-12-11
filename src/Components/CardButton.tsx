import { Button, styled } from "@mui/material"

const CardButton = styled(Button)()

CardButton.defaultProps = {
  variant: "text",
  sx: {ml: 3}
}

export default CardButton;