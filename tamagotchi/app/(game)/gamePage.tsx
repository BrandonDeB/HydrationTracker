import React, { useState, useEffect, useCallback } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    ImageBackground,
    TouchableWithoutFeedback,
    Dimensions,
} from 'react-native';
import {useFocusEffect, useRouter} from 'expo-router';
import * as SQLite from "expo-sqlite";
import {Sound} from "expo-av/build/Audio/Sound";
import {Audio} from "expo-av";

const { height, width } = Dimensions.get('window');

const COIN_SIZE = 50;
const FROG_SIZE = 100;
const OBSTACLE_COUNT = 3;

export default function GamePage() {
    const router = useRouter();

    const getRandomYPosition = useCallback((): number => {
        const possiblePositions = [height - 300, height - 500, height - 700];
        return possiblePositions[Math.floor(Math.random() * possiblePositions.length)];
    }, []);

    const [frogY, setFrogY] = useState(height - 200);
    const [gameActive, setGameActive] = useState(false);
    const [obstacles, setObstacles] = useState(
        Array.from({ length: OBSTACLE_COUNT }, () => ({
            x: width,
            y: getRandomYPosition(),
        }))
    );

    const topCoinPosition = { x: width / 2 - COIN_SIZE / 2, y: 80 };

    const startGame = () => {
        setGameActive(true);
        setFrogY(height - 200);
        resetObstacles();
    };

    const endGame = async () => {
        const db = await SQLite.openDatabaseAsync('hydration.db');
        await db.runAsync(
            `UPDATE user SET coins = coins + 100`,
        ).catch(function () {
            console.log("Preference Promise Rejected");
        });
        setGameActive(false);
        router.push('/(game)/endPage');
    };

    const resetObstacles = () => {
        setObstacles(
            Array.from({ length: OBSTACLE_COUNT }, () => ({
                x: width,
                y: getRandomYPosition(),
            }))
        );
    };

    const moveFrogUp = () => {
        if (!gameActive) return;

        const newFrogY = Math.max(frogY - 150, 100);
        setFrogY(newFrogY);

        if (newFrogY <= topCoinPosition.y + COIN_SIZE) {
            endGame();
        }
    };

    const moveObstacles = () => {
        setObstacles((prevObstacles) =>
            prevObstacles.map((obstacle) => {
                const newX = obstacle.x - 10;

                if (newX < -COIN_SIZE) {
                    return { x: width, y: getRandomYPosition() };
                }

                return { ...obstacle, x: newX };
            })
        );
    };

    const checkCollisions = () => {
        obstacles.forEach((obstacle) => {
            if (
                checkCollision(obstacle.x, obstacle.y) &&
                gameActive // Prevent unnecessary collision checks
            ) {
                endGame();
            }
        });
    };

    const checkCollision = (obstacleX: number, obstacleY: number) => {
        const frogTop = frogY;
        const frogBottom = frogY + FROG_SIZE;
        const frogLeft = width / 2 - FROG_SIZE / 2;
        const frogRight = width / 2 + FROG_SIZE / 2;

        const obstacleTop = obstacleY;
        const obstacleBottom = obstacleY + COIN_SIZE;
        const obstacleLeft = obstacleX;
        const obstacleRight = obstacleX + COIN_SIZE;

        return (
            frogRight > obstacleLeft &&
            frogLeft < obstacleRight &&
            frogBottom > obstacleTop &&
            frogTop < obstacleBottom
        );
    };


    useFocusEffect(
        useCallback(() => {
            let sound: Sound | undefined;

            const initialize = async () => {
                console.log('Loading Sound');
                const { sound: loadedSound } = await Audio.Sound.createAsync(
                    require('../../assets/BEBOs_REVENGE.mp3')
                );
                sound = loadedSound;
                console.log('Playing Sound');
                await sound.playAsync();
            };

            initialize();

            return () => {
                if (sound) {
                    console.log('Unloading Sounds');
                    sound.stopAsync();
                    sound.unloadAsync();
                }
            };
        }, [])
    );

    useEffect(() => {
        if (!gameActive) return;

        const gameInterval = setInterval(() => {
            moveObstacles();
            checkCollisions();
        }, 100); // Move obstacles and check collisions every 100ms

        return () => clearInterval(gameInterval);
    }, [gameActive, obstacles, frogY]);

    return (
        <ImageBackground
            source={require('../../assets/drawings/gameBG.jpg')}
            style={styles.background}
        >
            <TouchableWithoutFeedback onPress={moveFrogUp}>
                <View style={styles.container}>
                    {obstacles.map((obstacle, index) => (
                        <Image
                            key={index}
                            source={require('../../assets/drawings/frog3.png')}
                            style={[styles.obstacle, { left: obstacle.x, top: obstacle.y }]}
                        />
                    ))}

                    <Image
                        source={require('../../assets/drawings/gold.png')}
                        style={[
                            styles.obstacle,
                            {
                                left: topCoinPosition.x,
                                top: topCoinPosition.y,
                            },
                        ]}
                    />

                    <View style={styles.frogContainer}>
                        <Image
                            source={require('../../assets/drawings/frog1.png')}
                            style={[styles.frogImage, { transform: [{ translateY: frogY - height / 2 }] }]} // Dynamically position the frog
                        />
                    </View>

                    {!gameActive && (
                        <TouchableWithoutFeedback onPress={startGame}>
                            <View style={styles.startButton}>
                                <Text style={styles.startText}>Start Game</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    )}

                </View>
            </TouchableWithoutFeedback>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    frogContainer: {
        flex: 1, // Allow the container to stretch
        justifyContent: 'center', // Center vertically
        alignItems: 'center', // Center horizontally
    },
    obstacle: {
        position: 'absolute',
        width: COIN_SIZE,
        height: COIN_SIZE,
    },
    frogImage: {
        position: 'absolute',
        width: FROG_SIZE,
        height: FROG_SIZE,
    },
    startButton: {
        backgroundColor: '#5FC1FF',
        paddingVertical: 20,
        paddingHorizontal: 40,
        borderRadius: 25,
        position: 'absolute',
        bottom: 50,
    },
    startText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
});
