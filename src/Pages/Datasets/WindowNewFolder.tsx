/*
 *  Author: Tomáš Drdla (xdrdla04@stud.fit.vutbr.cz)
 */

import { CloseRounded, InputOutlined } from "@mui/icons-material"
import { Button, DialogTitle, FormControl, FormLabel, Input, Modal, Stack, Box } from "@mui/material"
import { useState } from "react"

const WindowNewFolder = (props: {
  id: string
  closeSelf: () => void
}) => {
  const [newFolderName, setNewFolderName] = useState("")

  const handleSubmit = (e: any) => {
    e.preventDefault()
    //mutateItem.mutate({name: newFolderName, id: props.id})
    props.closeSelf()
  }

  return (
    <Modal open>
      <Box>
        <CloseRounded sx={{ m:1 }}/>
        <DialogTitle>Create new folder</DialogTitle>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <FormControl>
              <FormLabel>Name:</FormLabel>
              <Input autoFocus value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)}/>
            </FormControl>
            <Button type="submit">Submit</Button>
          </Stack>
        </form>
      </Box>
    </Modal>
  )
}

export default WindowNewFolder;
