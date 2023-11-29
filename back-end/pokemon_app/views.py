#pokemon_app/views.py
from .models import Pokemon #imports the Pokemon model
from .serializers import PokemonSerializer #imports the PokemonSerializer
from django.http import JsonResponse # Our responses will now be returned in JSON so we should utilize a JsonResponse
# Import both APIView and Response from DRF
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import HTTP_204_NO_CONTENT, HTTP_400_BAD_REQUEST
# Create your views here.

# def all_pokemon(request):
#     pokemon = PokemonSerializer(Pokemon.objects.order_by('name'), many=True) # Utilize the serializer to serialize all of our Pokemon pulled from the Database
#     return JsonResponse({"pokemon": pokemon.data}) # JSON could only be interpreted in dictionary format so we need to ensure our response is a dictionary itself.

class All_pokemon(APIView):
    # Just like we said before we only want this information available for GET requests therefore we have to place this logic under a GET method. DRF will recognize the `get` method and trigger that method every time a GET request is sent
    def get(self, request):
        pokemon = PokemonSerializer(Pokemon.objects.order_by('name'), many=True)
        # Under response we don't necessarily need to send information in JSON format instead DRF will format our response and make it acceptable for Front-End frameworks
        return Response(pokemon.data)
    

class A_pokemon(APIView):

    # Method to fetch a Pokemon by ID or name
    def get_a_pokemon(self, id):
        if type(id) == int:
            return get_object_or_404(Pokemon, id=id)
        else:
            return get_object_or_404(Pokemon, name=id.title())

    # Handle GET request
    def get(self, request, id):
        pokemon = self.get_a_pokemon(id)
        serializer = PokemonSerializer(pokemon)
        return Response(serializer.data)

    # Handle PUT request
    def put(self, request, id):
        pokemon = self.get_a_pokemon(id)
        serializer = PokemonSerializer(pokemon, data=request.data, partial=True)
        if serializer.is_valid():
            if 'level_up' in request.data and request.data['level_up']:
                pokemon.level_up()
            if 'captured' in request.data and isinstance(request.data['captured'], bool):
                pokemon.change_caught_status(request.data.get("captured"))
            if "moves" in request.data:
                pokemon.moves.add(*request.data.get("moves", []))
            if "description" in request.data:
                pokemon.description = request.data.get("description")
            if "type" in request.data:
                pokemon.type = request.data.get("type")
            serializer.save()
            return Response(status=HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)