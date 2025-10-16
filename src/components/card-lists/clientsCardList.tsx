import { TListClientsOutput } from "@/server/api/routers/clients/schemas/validation"
import { CardButtons } from "../card-item/CardButtons"
import { CardItem } from "../card-item/CardItem"
import { DeleteClientButton } from "../delete-buttons/DeleteClientButton"
import { BaseCardList } from "./BaseCardList"

interface ClientsCardListProps {
  data: TListClientsOutput
}

export const ClientsCardList: React.FC<ClientsCardListProps> = ({ data }) => {
  return (
    <BaseCardList emptyMessage="clients" isEmpty={data.clients.length === 0}>
      {data.clients.map((client) => {
        const name = `${client.firstName} ${client.lastName}`

        return (
          <CardItem
            key={client.id}
            item={{ ...client, name }}
            ButtonSection={
              <CardButtons
                id={client.id}
                href="/clients"
                DeleteButton={<DeleteClientButton id={client.id} name={name} />}
              />
            }
          >
            <p className={"mb-2"}>{client.email}</p>
            <p className={"text-xs text-muted-foreground"}>
              {client.addresses[0].street} {client.addresses[0].number}
            </p>
            <p className={"text-xs text-muted-foreground"}>
              {client.addresses[0].city} {client.addresses[0].state}
            </p>
            <p className={"text-xs text-muted-foreground"}>
              {client.addresses[0].cep}
            </p>
          </CardItem>
        )
      })}
    </BaseCardList>
  )
}
