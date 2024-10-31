// Sélection des éléments de navigation
const navItems = document.querySelectorAll('.nav-item')
const list = document.getElementById('list')
const cocktailDetails = document.getElementById('cocktail-details')

// Activer le premier élément de navigation par défaut
navItems[0].classList.add('active')

// Ajouter des écouteurs d'événements aux éléments de navigation
navItems.forEach(item => {
    item.addEventListener('click', function(event) {
        // Retirer la classe 'active' de tous les éléments, et ajouter à l'élément cliqué
        navItems.forEach(item => item.classList.remove('active'))
        event.currentTarget.classList.add('active')

        // Appeler la fonction fetchData avec l'ID de catégorie
        fetchData(event.currentTarget.id)
    })
})

// Fonction pour récupérer les cocktails par catégorie
async function fetchData(id) {
    try {
        const response = await fetch(`https://thecocktaildb.com/api/json/v1/1/filter.php?c=${id}`)
        const CocktailData = await response.json()
        addItems(CocktailData.drinks)
    } catch (error) {
        console.log(error)
    }
}

// Fonction pour afficher les détails du cocktail
async function CocktailRecette(id) {
    try {
        const recette = await fetch(`https://thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`)
        const data = await recette.json()
        const drink = data.drinks[0]

        // Vider les détails précédents
        cocktailDetails.innerHTML = ''

        // Afficher le titre du cocktail
        const title = document.createElement('h2')
        title.textContent = drink.strDrink

        // Afficher l'image du cocktail
        const image = document.createElement('img')
        image.src = drink.strDrinkThumb
        image.classList.add('thumbnail')

        // Créer une liste pour les ingrédients
        const ingredientsList = document.createElement('ul')
        ingredientsList.classList.add('ingredients-list')

        // Boucler sur les ingrédients et mesures
        for (let i = 1; i <= 15; i++) {
            const ingredient = drink[`strIngredient${i}`]
            const measure = drink[`strMeasure${i}`]

            if (ingredient) {
                const listItem = document.createElement('li')
                listItem.textContent = `${measure ? measure : ''} ${ingredient}`
                ingredientsList.appendChild(listItem)
            }
        }

        // Afficher les instructions
        const instructions = document.createElement('p')
        instructions.textContent = drink.strInstructions

        // Ajouter les éléments au conteneur des détails
        cocktailDetails.appendChild(title)
        cocktailDetails.appendChild(image)
        cocktailDetails.appendChild(ingredientsList)
        cocktailDetails.appendChild(instructions)

    } catch (error) {
        console.log(error)
    }
}

// Fonction pour ajouter des cocktails à la liste
function addItems(drinks) {
    list.innerHTML = '' // Vider la liste

    drinks.forEach(drink => {
        const container = document.createElement('div')
        container.classList.add('list-item', 'col-12', 'col-sm-3')

        // Titre et image du cocktail
        const title = document.createElement('h3')
        title.textContent = drink.strDrink
        const thumbnail = document.createElement('img')
        thumbnail.src = drink.strDrinkThumb
        thumbnail.classList.add('thumbnail')

        // Ajouter le titre et l'image dans le container
        container.appendChild(thumbnail)
        container.appendChild(title)

        // Ajouter le container dans la liste
        list.appendChild(container)

        // Écouteur d'événement pour afficher les détails du cocktail
        container.addEventListener('click', function() {
            CocktailRecette(drink.idDrink)
        })
    })
}

// Charger par défaut les cocktails de la catégorie 'Cocktail'
fetchData('Cocktail')
