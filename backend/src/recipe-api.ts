const apiKey = process.env.API_KEY;

export const searchRecipies = async (searchTerm: string, page: number) => {
    if (!apiKey) {
        throw new Error("Api Key not found");
    }

    const url = new URL("https://api.spoonacular.com/recipes/complexSearch");

    const queryParams = {
        apiKey,
        query: searchTerm,
        number: "10",
        offset: (page * 10).toString()
    }
    url.search = new URLSearchParams(queryParams).toString();

    try {
        const serachResponse = await fetch(url);
        const resultsJson = await serachResponse.json();
        return resultsJson;
    } catch (error) {
        console.log(error);
    }
}