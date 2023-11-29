# Import necessary modules and classes
from .models import Pokemon  # Imports the Pokemon model
from .serializers import PokemonSerializer  # Imports the PokemonSerializer
from django.http import JsonResponse  # Used for returning JsonResponse
from django.shortcuts import get_object_or_404  # Utility for object retrieval or 404 error
from rest_framework.views import APIView  # Base class for handling API requests
from rest_framework.response import Response  # Used for returning API responses
from rest_framework.status import HTTP_204_NO_CONTENT, HTTP_400_BAD_REQUEST  # Import HTTP status codes
from rest_framework.status import HTTP_201_CREATED
# Class to handle requests for all Pokemon
class All_pokemon(APIView):
    # GET method for retrieving all Pokemon
    def get(self, request):
        # Serialize data for all Pokemon objects
        pokemon = PokemonSerializer(Pokemon.objects.order_by('name'), many=True)
        # Return the serialized data as a response
        return Response(pokemon.data)
    
    def post(self, request):
        # We could create a pokemon by specifying each individual field but that's obviously not optimal
        # new_pokemon = Pokemon(name = request.data['name'], level = request.data['level'], description = request.data['description'])
        # instead we can use the PokemonSerializers kwargs method and pass in request.data (a dict) into the create argument
        new_pokemon = PokemonSerializer(data=request.data)
        if new_pokemon.is_valid():
            new_pokemon.save()
            return Response(new_pokemon.data, status=HTTP_201_CREATED)
        else:
            return Response(new_pokemon.errors, status=HTTP_400_BAD_REQUEST)

# Class to handle requests for a single Pokemon
class A_pokemon(APIView):

    def delete(self, request, id):
        # get a pokemon from our database
        pokemon = self.get_a_pokemon(id)
        # delete instance and database entry
        pokemon.delete()
        # return the name of the pokemon deleted
        return Response(status=HTTP_204_NO_CONTENT)

    # Helper method to retrieve a Pokemon by ID or name
    def get_a_pokemon(self, id):
        # Fetch Pokemon by ID if id is integer, otherwise by name
        if type(id) == int:
            return get_object_or_404(Pokemon, id=id)
        else:
            return get_object_or_404(Pokemon, name=id.title())

    # GET method for a specific Pokemon
    def get(self, request, id):
        # Use helper method to get a Pokemon instance
        pokemon = self.get_a_pokemon(id)
        # Serialize the Pokemon data
        serializer = PokemonSerializer(pokemon)
        # Return serialized data as a response
        return Response(serializer.data)

    # PUT method to update a specific Pokemon
    def put(self, request, id):
        pokemon = self.get_a_pokemon(id)
        serializer = PokemonSerializer(pokemon, data=request.data, partial=True)
        if serializer.is_valid():
            # Directly set the captured status if it's included in the request
            if 'captured' in request.data and isinstance(request.data['captured'], bool):
                pokemon.captured = request.data['captured']

            if 'level_up' in request.data and request.data['level_up']:
                pokemon.level_up()
            if "moves" in request.data:
                pokemon.moves.add(*request.data.get("moves", []))
            if "description" in request.data:
                pokemon.description = request.data.get("description")
            if "type" in request.data:
                pokemon.type = request.data.get("type")

            pokemon.save()
            return Response(status=HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)