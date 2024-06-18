import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, Skeleton, Stack, TextField } from "@mui/material";
import ContentCard from "../../Components/ContentCard";
import ContentHeader from "../../Components/ContentHeader";
import FormsWrapped from "../../Components/FormsWrapped";
import { Edit } from "@mui/icons-material";
import { useFetch } from "use-http";
import { SchemasData } from "../../types/global";
import { useGetSchemaQuery } from "../../Services/schemas";
import { useTranslation } from "react-i18next";

const TemplateView = () => {
    const { t } = useTranslation()

    const navigate = useNavigate();
    const { templateId } = useParams()

    const data = useGetSchemaQuery(templateId as string).data



    if (data){
        return (
            <Box>
                <ContentHeader title={t('TemplatesEdit.templateView')} actions={
                    <Button variant={"contained"} size="medium" endIcon={<Edit />} onClick={() => navigate(`/templates/${data?.id}/edit`)}>
                        {t('TemplatesEdit.edit')}
                    </Button>
                }>
                <Stack direction="row" justifyContent="center" alignItems="baseline" gap={2}>
                    <TextField
                        autoFocus
                        margin="dense"
                        label={t('TemplatesEdit.templateName')}
                        fullWidth
                        variant="outlined"
                        value={data?.name}
                        disabled={true}
                        sx={{maxWidth: "33.33%", background: "#FFF"}}
                        />
                    <TextField
                        margin="dense"
                        label={t('TemplatesEdit.templateDescription')}
                        fullWidth
                        variant="outlined"
                        value={data?.description}
                        disabled={true}
                        sx={{maxWidth: "66.67%", background: "#FFF"}}
                        />
                </Stack>
            </ContentHeader>
            <ContentCard title={t('TemplatesEdit.preview')}>
                {(data?.schema || data?.uischema) ? 
                    <FormsWrapped schema={data.schema} uischema={data.uischema} data={{}} setData={() => {}} />
                    : <>{t('TemplatesEdit.noSchema')}</>}
                </ContentCard>
            </Box>
        )
    } else {
        return (
            <Box>
                <ContentHeader title={t('TemplatesEdit.templateView')} actions={
                    <Skeleton>
                        <Button variant={"contained"} size="medium" endIcon={<Edit />} onClick={() => {}}>
                            {t('TemplatesEdit.edit')}
                        </Button>
                    </Skeleton>
                    }>
                    <Stack direction="row" justifyContent="center" alignItems="baseline" gap={2}>
                        <Skeleton width={"33%"}>
                            <TextField
                            autoFocus
                            margin="dense"
                            label={t('TemplatesEdit.templateName')}
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
                            label={t('TemplatesEdit.templateDescription')}
                            fullWidth
                            variant="outlined"
                            value={""}
                            disabled={true}
                            sx={{maxWidth: "66.67%", background: "#FFF"}}
                            />
                        </Skeleton>
                    </Stack>
                </ContentHeader>
                <ContentCard title={t('TemplatesEdit.preview')}>
                    <Skeleton />
                </ContentCard>
            </Box>
        )
    }
}

export default TemplateView;