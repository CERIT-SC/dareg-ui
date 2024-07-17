import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, Skeleton, Stack, TextField } from "@mui/material";
import ContentCard from "../../Components/ContentCard";
import ContentHeader from "../../Components/ContentHeader";
import FormsWrapped from "../../Components/FormsWrapped";
import { AccessTime, AccountCircle, Assignment, Edit, RestorePage } from "@mui/icons-material";
import { useFetch } from "use-http";
import { SchemasData } from "../../types/global";
import { Schema, useGetSchemaQuery } from "../../Services/schemas";
import { useTranslation } from "react-i18next";

const TemplateView = () => {
    const { t } = useTranslation()

    const navigate = useNavigate();
    const { templateId } = useParams()

    const data = useGetSchemaQuery(templateId as string).data



    if (data){
        return (
            <Box>
                <ContentHeader<Schema> title={t('TemplatesEdit.templateView')} actions={
                    <Button variant={"contained"} size="medium" endIcon={<Edit />} onClick={() => navigate(`/templates/${data?.id}/edit`)}>
                        {t('TemplatesEdit.edit')}
                    </Button>
                }
                metadata={[
                        // { id: "name", value: data?.name ?? "", label: t('TemplatesEdit.templateName'), icon: <Assignment /> },
                        { id: "version", value: data?.version.toString() ?? "", label: t('TemplatesEdit.version'), icon: <RestorePage /> },
                        { id: "created", value: data.created || "", label: t('TemplateList.creation'), icon: <AccessTime />, renderCell: (value) => (new Date(value).toLocaleString()) },
                        { id: "created_by", value: data.created_by?.full_name || "Unknown", label: t('DatasetView.author'), icon: <AccountCircle /> }]
                }
                >
                <Stack direction="row" justifyContent="center" alignItems="baseline" gap={2}>
                    <TextField
                        autoFocus
                        margin="dense"
                        label={t('TemplatesEdit.templateName')}
                        fullWidth
                        variant="outlined"
                        value={data?.name}
                        disabled={true}
                        sx={{maxWidth: "33.33%", background: (theme) => theme.palette.background.paper}}
                        />
                    <TextField
                        margin="dense"
                        label={t('TemplatesEdit.templateDescription')}
                        fullWidth
                        variant="outlined"
                        value={data?.description}
                        disabled={true}
                        sx={{maxWidth: "66.67%", background: (theme) => theme.palette.background.paper}}
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
                            sx={{maxWidth: "33.33%", background: (theme) => theme.palette.background.paper}}
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
                            sx={{maxWidth: "66.67%", background: (theme) => theme.palette.background.paper}}
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