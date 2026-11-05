import { useState } from 'react'
import { FiCheckCircle } from 'react-icons/fi'
import FadeIn from '../FadeIn'
import {
  ListContainer,
  ListItem,
  FileInfo,
  IconWrapper,
  FileName,
  TimeStamp,
  DownloadButton,
  EmptyMessage,
  TitleHistory
} from './styles'

const CompletedTransfers = ({ transfers }) => {
  const [expired, setExpired] = useState({})

  if (!transfers || transfers.length === 0) {
    return (
      <ListContainer>
        <EmptyMessage>Nenhuma conversão concluída.</EmptyMessage>
      </ListContainer>
    )
  }

  const formatTimestamp = (timestamp) => {
    const data = new Date(timestamp)
    return data.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleDownload = async (id, url, fileName) => {
    try {
      const response = await fetch(url)
      const contentType = response.headers.get('content-type') || ''

      if (!response.ok || contentType.includes('application/json')) {
        setExpired((prev) => ({ ...prev, [id]: true }))
        return
      }

      const blob = await response.blob()
      const blobUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = blobUrl
      link.setAttribute('download', fileName || 'arquivo.pdf')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(blobUrl)
    } catch {
      setExpired((prev) => ({ ...prev, [id]: true }))
    }
  }

  return (
    <ListContainer>
      <TitleHistory>Histórico de conversões</TitleHistory>
      {transfers.map((transfer) => (
        <FadeIn key={transfer.id}>
          <ListItem>
            <FileInfo>
              <IconWrapper>
                <FiCheckCircle />
              </IconWrapper>
              <div>
                <FileName>{transfer.originalName}</FileName>
                <TimeStamp>{formatTimestamp(transfer.timestamp)}</TimeStamp>
                {expired[transfer.id] && (
                  <TimeStamp role="alert">
                    Arquivo expirado. Converta o documento novamente.
                  </TimeStamp>
                )}
              </div>
            </FileInfo>
            <DownloadButton
              disabled={expired[transfer.id]}
              onClick={() => {
                handleDownload(transfer.id, transfer.downloadUrl, transfer.convertedName)
              }}
            >
              {expired[transfer.id] ? 'Expirado' : 'Baixar'}
            </DownloadButton>
          </ListItem>
        </FadeIn>
      ))}
    </ListContainer>
  )
}

export default CompletedTransfers