import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { API_IMAGE_URL } from '@env';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Theme } from '@/theme/constants';

interface Props {

  title: string;

  poster_path: string;

  vote_average: number;

  release_date: string;

  overview: string;

  onPress?: () => void;

  onRemove?: () => void; // Added onRemove prop

}



const MovieCard: React.FC<Props> = ({ 

  title, 

  poster_path, 

  vote_average, 

  release_date,

  overview,

  onPress,

  onRemove,

}) => {

  return (

    <TouchableOpacity 

      activeOpacity={0.9}

      onPress={onPress} 

      style={styles.container}

    >

      <Image 

        source={{ uri: `${API_IMAGE_URL}${poster_path}` }} 

        style={styles.poster}

        resizeMode="cover"

      />

      <View style={styles.details}>

        <View style={styles.headerContent}>

          <View style={styles.titleRow}>

            <Text style={styles.title} numberOfLines={1}>{title}</Text>

            {onRemove && (

              <TouchableOpacity onPress={onRemove} style={styles.removeButton}>

                <Ionicons name="close" size={20} color="#333" />

              </TouchableOpacity>

            )}

          </View>

          <Text style={styles.dateText}>{release_date}</Text>

          

          <View style={styles.ratingContainer}>

            <Ionicons name="star" size={12} color="#FFD700" />

            <Text style={styles.ratingText}>{vote_average.toFixed(1)}</Text>

          </View>

        </View>



        <Text style={styles.overview} numberOfLines={3}>

          {overview}

        </Text>

      </View>

    </TouchableOpacity>

  );

};



const styles = StyleSheet.create({

  container: {

    flexDirection: 'row',

    backgroundColor: '#FFFFFF',

    borderRadius: Theme.borderRadius.card,

    marginBottom: 16,

    shadowColor: '#000',

    shadowOffset: {

      width: 0,

      height: 1,

    },

    shadowOpacity: 0.20,

    shadowRadius: 1.41,

    elevation: 2,

    width: '100%',

  },

  poster: {

    width: 100,

    height: 140,

    backgroundColor: '#E0E0E0',

    borderTopLeftRadius: Theme.borderRadius.card,

    borderBottomLeftRadius: Theme.borderRadius.card,

  },

  details: {

    flex: 1,

    padding: 12,

    justifyContent: 'flex-start',

  },

  headerContent: {

    marginBottom: 8,

  },

  titleRow: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    marginBottom: 4,

  },

  removeButton: {

    padding: 4,

    marginTop: -8,

    marginRight: -8,

  },

  title: {

    flex: 1,

    fontSize: 16,

    fontWeight: '700',

    color: '#042541',

  },

  dateText: {

    fontSize: 12,

    color: '#8E8E93',

    marginBottom: 4,

  },

  ratingContainer: {

    flexDirection: 'row',

    alignItems: 'center',

  },

  ratingText: {

    fontSize: 12,

    fontWeight: '600',

    color: '#4A4A4A',

    marginLeft: 4,

  },

  overview: {

    fontSize: 12,

    color: '#666666',

    lineHeight: 16,

  },

});



export default MovieCard;