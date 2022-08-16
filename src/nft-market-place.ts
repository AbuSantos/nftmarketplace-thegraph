import { Address,BigInt } from "@graphprotocol/graph-ts"
import {
  // NftMarketPlace,
  // HighestBidIncrease,
  ItemBought as ItemBoughtEvent,
  ItemCanceled as ItemCanceledEvent,
  ItemListed as ItemListedEvent
} from "../generated/NftMarketPlace/NftMarketPlace"
import {ItemListed, ActiveItem, ItemBought, ItemCanceled} from "../generated/schema";

// export function handleHighestBidIncrease(event: HighestBidIncrease): void {
//   // Entities can be loaded from the store using a string ID; this ID
//   // needs to be unique across all entities of the same type
//   let entity = ExampleEntity.load(event.transaction.from.toHex())

//   // Entities only exist after they have been saved to the store;
//   // `null` checks allow to create entities on demand
//   if (!entity) {
//     entity = new ExampleEntity(event.transaction.from.toHex())

//     // Entity fields can be set using simple assignments
//     entity.count = BigInt.fromI32(0)
//   }

//   // BigInt and BigDecimal math are supported
//   entity.count = entity.count + BigInt.fromI32(1)

//   // Entity fields can be set based on event parameters
//   entity.bidder = event.params.bidder
//   entity.amount = event.params.amount

//   // Entities can be written to the store with `.save()`
//   entity.save()
// }

export function handleItemBought(event: ItemBoughtEvent): void {
  //the same ID doesnt matter, cause theyre the same ID accross diferent objects
  let itemBought = ItemBought.load(getIdFromEventparams(event.params.tokenId, event.params.nftAddress))
  let activeItem = ActiveItem.load(getIdFromEventparams(event.params.tokenId, event.params.nftAddress))
  
  if(!itemBought){
    itemBought = new ItemBought(
      getIdFromEventparams(event.params.tokenId, event.params.nftAddress)
    )
  }
  itemBought.buyer= event.params.buyer
  itemBought.nftAddress = event.params.nftAddress
  itemBought.tokenId = event.params.tokenId
  activeItem!.buyer = event.params.buyer
  
  itemBought.save()
  activeItem!.save()
}

export function handleItemCanceled(event: ItemCanceledEvent): void {
  let itemCanceled = ItemCanceled.load(
    getIdFromEventparams(event.params.tokenId, event.params.nftAddress)
)
let activeItem = ActiveItem.load(
    getIdFromEventparams(event.params.tokenId, event.params.nftAddress)
)
if (!itemCanceled) {
    itemCanceled = new ItemCanceled(
      getIdFromEventparams(event.params.tokenId, event.params.nftAddress)
    )
}
  itemCanceled.seller = event.params.seller
  itemCanceled.nftAddress = event.params.nftAddress
  itemCanceled.tokenId = event.params.tokenId
  activeItem!.buyer = Address.fromString("0x000000000000000000000000000000000000dEaD")

  itemCanceled.save()
  activeItem!.save()
 }

export function handleItemListed(event: ItemListedEvent): void {
  let itemListed = ItemListed.load(getIdFromEventparams(event.params.tokenId, event.params.nftAddress))
  let activeItem = ActiveItem.load(getIdFromEventparams(event.params.tokenId, event.params.nftAddress))

  if(!itemListed){
    itemListed = new ItemListed(getIdFromEventparams(event.params.tokenId, event.params.nftAddress))
  }

  if (!activeItem) {
    activeItem = new ActiveItem(getIdFromEventparams(event.params.tokenId, event.params.nftAddress))
  }
  
  itemListed.seller = event.params.seller
  activeItem.seller = event.params.seller

  itemListed.nftAddress= event.params.nftAddress
  activeItem.nftAddress= event.params.nftAddress

  itemListed.tokenId = event.params.tokenId
  activeItem.tokenId = event.params.tokenId

  itemListed.price = event.params.price
  activeItem.price = event.params.price

  itemListed.save()
  activeItem.save()
}

function getIdFromEventparams(tokenId:BigInt, nftAddress: Address):string{
  return tokenId.toHexString() + nftAddress.toHexString();
}