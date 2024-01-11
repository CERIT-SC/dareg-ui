/*
 *  Author: Tomáš Drdla (xdrdla04@stud.fit.vutbr.cz)
 */

import { CloseRounded, InputOutlined } from "@mui/icons-material"
import { Box, Button, DialogTitle, FormControl, FormLabel, Input, Modal, Stack } from "@mui/material"
import { useState } from "react"

const WindowRenameItem = (props: {
  //item: Item
  closeSelf: () => void
}) => {
  const [itemName, setNewItemName] = useState("props.item.name")

  const handleSubmit = (e: any) => {
    e.preventDefault()
    //mutateItem.mutate({name: itemName, id: props.item.id})
    props.closeSelf()
  }

  return (
    <Modal open>
      <Box>
        <CloseRounded sx={{ m:1 }}/>
        <DialogTitle>Rename</DialogTitle>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <FormControl>
              <FormLabel>Name:</FormLabel>
              <Input autoFocus value={itemName} onChange={(e) => setNewItemName(e.target.value)}/>
            </FormControl>
            <Button type="submit">Submit</Button>
          </Stack>
        </form>
      </Box>
    </Modal>
  )
}

export default WindowRenameItem;
