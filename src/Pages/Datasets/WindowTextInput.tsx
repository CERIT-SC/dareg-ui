/*
 *  Author: Tomáš Drdla (xdrdla04@stud.fit.vutbr.cz)
 */

import { Button, DialogTitle, FormControl, FormLabel, Input, Modal, Stack, Box, DialogContent, DialogActions, TextField, Typography } from "@mui/material"
import { useState } from "react"
import { ExplorerItem } from "../../types/global"
import { useTranslation } from "react-i18next"

const WindowTextInput = (props: {
  item: Partial<ExplorerItem>,
  closeSelf: () => void,
  type: "new"|"rename"
}) => {
  const { t } = useTranslation()

  const [name, setName] = useState(props.type==="rename" ? props.item.name : "")

  const handleSubmit = (e: any) => {
    e.preventDefault()
    //mutateItem.mutate({name: newFolderName, id: props.id})
    props.closeSelf()
  }

  return (
    <DialogContent sx={{ width: 400 }}>
      <Typography variant="h6">
        {props.type==="new" ? t('WindowTextInput.newFolder') : t('WindowTextInput.rename')}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <FormControl>
            <TextField
              autoFocus
              margin="dense"
              value={name}
              onChange={(e) => setName(e.target.value)}
              name="name"
              label="Name"
              type="text"
              fullWidth
              variant="standard"
            />
          </FormControl>
          <Stack direction="row-reverse" spacing={2}>
            <Button type="submit" variant="contained">{t('WindowTextInput.submit')}</Button>
            <Button onClick={props.closeSelf}>{t('WindowTextInput.cancel')}</Button>
          </Stack>
        </Stack>
      </form>
    </DialogContent>
  )
}

export default WindowTextInput;
