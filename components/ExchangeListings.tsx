import { formatCurrency, timeAgo } from "@/lib/utils";
import DataTable from "./DataTable";

const ExchangeListings = ({ items }: { items: Ticker[] }) => {
    const exchangeListingsColumns: DataTableColumn<Ticker>[] = [
        {
            header: 'Exchange',
            cellClassName: 'exchange-name',
            cell: (exchange) => exchange.market.name,
        },
        {
            header: 'Pair',
            cellClassName: 'pair',
            cell: (exchange) => (
                <>
                    <p>{exchange.base}</p>
                    /
                    <p>{exchange.target}</p>
                </>
            ),
        },
        {
            header: 'Price',
            cellClassName: 'price-cell',
            cell: (exchange) => formatCurrency(exchange.converted_last.usd),
        },
        {
            header: 'Last Traded',
            headClassName: 'text-end',
            cellClassName: 'time-cell',
            cell: (exchange) => timeAgo(exchange.timestamp),
        }
    ];

    return (
        <div className='exchange-section'>
            <h4>Exchange Listings</h4>

            <DataTable
                columns={exchangeListingsColumns}
                data={items}
                rowKey={(_, idx) => idx}
                tableClassName='exchange-table'
            />
        </div>
    )
}

export default ExchangeListings
