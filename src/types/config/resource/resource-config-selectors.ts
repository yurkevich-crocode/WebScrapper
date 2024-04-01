export interface ResourceConfigSelectors {
    salonLink: string,
    nextPageBtn: string,

    name: string,
    description: string,
    descriptionShowMoreBtn?: string,
    address: string,
    rating: string,
    image: string,
    imagesShoeMoreBtn?: string,
    sliderDots?: string,
    sliderNextBtn?: string,
    workHours: string,
    showScheduleBtn?: string,
    phone: string,
    socialMediaLink: string
    specialTags: string,

    serviceSetBlock: string,
    serviceSetName: string,
    serviceSetShowMoreBtn?: string,
    serviceBlock: string,
    serviceName: string,
    serviceDescription: string,
    servicePrice: string,
    serviceDuration: string,

    subServiceBlock?: string,
    subServiceName?: string,
}