import { Edit } from '@mui/icons-material';
import { Box, Skeleton, Button, Stack, TextField } from '@mui/material';
import React from 'react';
import ContentCard from './ContentCard';
import ContentHeader from './ContentHeader';
import { ViewModes } from '../types/enums';
import { useTranslation } from 'react-i18next';

const SkeletonView = ({name, mode}: {name: string, mode: ViewModes}) => {
    const { t } = useTranslation()

    return (
        <Box>
        <ContentHeader title={`${name}: ${t('mode.'+mode)}`} actions={
            <Skeleton>
                <Button variant={"contained"} size="medium" endIcon={<Edit />} onClick={() => {}}>
                    Edit
                </Button>
            </Skeleton>
            }>
            <Stack direction="row" justifyContent="center" alignItems="baseline" gap={2}>
                <Skeleton width={"33%"}>
                    <TextField
                    autoFocus
                    margin="dense"
                    label="Template name"
                    fullWidth
                    variant="outlined"
                    value={""}
                    disabled={true}
                    sx={{maxWidth: "33.33%", background: "#FFF"}}
                    />
                </Skeleton>
                <Skeleton width={"67%"}>
                <TextField
                    margin="dense"
                    label="Template description"
                    fullWidth
                    variant="outlined"
                    value={""}
                    disabled={true}
                    sx={{maxWidth: "66.67%", background: "#FFF"}}
                    />
                </Skeleton>
            </Stack>
        </ContentHeader>
        <ContentCard>
            <Stack direction="column" gap={0}>
                <Skeleton width={"100%"} height={70} />
                <Skeleton width={"70%"} height={50} />
                <Skeleton width={"50%"} height={50} />
            </Stack>
        </ContentCard>
    </Box>
    );
};

export default SkeletonView;