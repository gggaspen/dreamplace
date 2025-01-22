export const QUERY_GET_ALL_EVENTS: string = `
    query GetEventById($id: String!) {
        events(documentId: $id) {
            date
            name
            location
            documentId
            description
            active
            cover_mobile_connection {
                nodes {
                alternativeText
                url
                }
            }
            cover_desktop {
                alternativeText
                url
            }
        }
    }`;
