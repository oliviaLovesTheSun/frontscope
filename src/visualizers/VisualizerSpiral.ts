import {VisualizerExportModule} from '@/visualizers/VisualizerInterface'
import {VisualizerDefault} from '@/visualizers/VisualizerDefault'
import {Color} from 'p5'
import {def} from '@vue/shared'
import {ceil, e, floor, isBoolean, re, sqrt} from 'mathjs'
import {Teleport} from 'vue'

const FIBONACCI_SEQUENCE = [
    0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597,
    2584, 4181, 6765, 10946, 17711, 28657, 46368, 75025, 121393, 196418,
    317811, 514229, 832040, 1346269, 2178309, 3524578, 5702887, 9227465,
    14930352, 24157817, 39088169, 63245986, 102334155, 165580141, 267914296,
    433494437, 701408733, 1134903170, 1836311903, 2971215073, 4807526976,
    7778742049, 12586269025,
]
const LUCAS_SEQUENCE = [
    2, 1, 3, 4, 7, 11, 18, 29, 47, 76, 123, 199, 322, 521, 843, 1346, 2207,
    3571, 5778, 9349, 15127, 24476, 39603, 64079, 103682, 167761, 271443,
    439204, 710647, 1149851, 1860498, 3010349, 4870847, 7881196, 12752043,
    20633239, 33385282, 54018521, 87403803, 141422324, 228826127, 370248451,
    599074578, 969323029, 1568397607, 2537720636, 4106118243, 6643838879,
    10749957122,
]

const BLACK = '#000000'
const WHITE = '#ffffff'

const RED = '#ff5733'
const ORANGE = '#ff9d33'
const YELLOW = '#e6ff33'
const GREEN = '#14cd33'
const BLUE = '#3388ff'
const PURPLE = '#8814cd'
const CYAN = '#00ffff'
const MAGENTA = '#ff0080 '
const VERDANT = '#9BBF30'
const VIOLET = '#ff00ff'
const MUSTARD = 'rgb(223,186,105)'
const GRAY = 'rgb(140, 140, 140)'

const HIGHLIGHT = RED
const SHADE13 = 'rgb(255, 255, 255)'
const SHADE12 = 'rgb(240, 240, 240)'
const SHADE11 = 'rgb(220, 220, 220)'
const SHADE10 = 'rgb(200, 200, 200)'
const SHADE9 = 'rgb(180, 180, 180)'
const SHADE8 = 'rgb(160, 160, 160)'
const SHADE7 = 'rgb(140, 140, 140)'
const SHADE6 = 'rgb(120, 120, 120)'
const SHADE5 = 'rgb(100, 100, 100)'
const SHADE4 = 'rgb(080, 080, 080)'
const SHADE3 = 'rgb(060, 060, 060)'
const SHADE2 = 'rgb(040, 040, 040)'
const SHADE1 = 'rgb(020, 020, 020)'
const SHADE0 = 'rgb(000, 000, 000)'

//Path variables
let x = 0
let y = 0
let currentDirection = 'right'
let numberToTurnAt = 0
let incrementForNumberToTurnAt = 1
let whetherIncrementShouldIncrementForSpiral = true

//User options for visualizer
enum Preset {
    None,
    Primes,
    Factors,
    Factors_and_Primes,
    Divisibility,
    Abundant_Numbers,
    Abundant_Numbers_And_Primes,
    Polygonal_Numbers_Without_Square_Numbers,
    Polygonal_Numbers_With_Square_Numbers,
}

enum PathType {
    Spiral,
    Rows,
    Inwards_Spiral,
}

//TODO Most of these are not implemented.
enum Property {
    None,
    Number_Sequence,
    Prime,
    Even,
    Divisible_ByThree,
    Negative,
    Sum_Of_Two_Squares,
    Fibonacci_Number,
    Lucas_Number,
    Triangular_Number,
    Square_Number,
    Pentagonal_Number,
    Hexagonal_Number,
    Heptagonal_Number,
    Octagonal_Number,
    Abundant,
    Perfect,
    Deficient,
    Semi_Prime,
}

//TODO The commented out visualizations are yet to be implemented.
enum PropertyVisualization {
    None,
    Color,
    //Secondary_Color,
    //Tint,
    //Shade,
    //Circularity,
}

enum VisualInfo {
    None,
    Show_Path,
    Show_Numbers,
}

enum Formula {
    N,
    N_SQUARED,
    N_SQUARED_PLUS_1,
    N_SQUARED_MINUS_N,
    N_SQUARED_MINUS_N_PLUS_1,
    TWO_N_SQUARED,
    THREE_N_SQUARED,
    N_CUBED,
    N_CUBED_PLUS_N_SQUARED,
    N_CUBED_PLUS_N_SQUARED_PLUS_N,
    TWO_TO_THE_N,
}

class VisualizerSpiral extends VisualizerDefault {
    name = 'Spiral'
    description = 'This puts numbers in a spiral!'
    amountOfNumbers = 40000
    startingIndex = 0
    message = ''
    preset = Preset.Primes
    visualInfo = VisualInfo.None
    pathType = PathType.Spiral
    resetAndAugmentByOne = false
    formula = Formula.N
    backgroundColor = BLACK
    property1 = Property.None
    property1Visualization = PropertyVisualization.None
    property1MainColor = RED
    property2 = Property.None
    property2Visualization = PropertyVisualization.None
    property2MainColor = BLUE
    property3 = Property.None
    property3Visualization = PropertyVisualization.None
    property3MainColor = GREEN
    property4 = Property.None
    property4Visualization = PropertyVisualization.None
    property4MainColor = YELLOW
    property5 = Property.None
    property5Visualization = PropertyVisualization.None
    property5MainColor = ORANGE
    property6 = Property.None
    property6Visualization = PropertyVisualization.None
    property6MainColor = PURPLE
    property7 = Property.None
    property7Visualization = PropertyVisualization.None
    property7MainColor = CYAN
    property8 = Property.None
    property8Visualization = PropertyVisualization.None
    property8MainColor = MAGENTA
    property9 = Property.None
    property9Visualization = PropertyVisualization.None
    property9MainColor = VERDANT
    property10 = Property.None
    property10Visualization = PropertyVisualization.None
    property10MainColor = VIOLET
    property11 = Property.None
    property11Visualization = PropertyVisualization.None
    property11MainColor = MUSTARD
    property12 = Property.None
    property12Visualization = PropertyVisualization.None
    property12MainColor = GRAY

    params = {
        preset: {
            value: this.preset,
            from: Preset,
            displayName: 'Presets',
            required: false,
        },
        amountOfNumbers: {
            value: this.amountOfNumbers,
            forceType: 'integer',
            displayName: 'Amount of Numbers',
            required: false,
            description:
                'Note: There is an increased lag time over 10,000 numbers',
        },
        startingIndex: {
            value: this.startingIndex,
            forceType: 'integer',
            from: PathType,
            displayName: 'Starting Index',
            required: false,
            description: 'Note: This does not accept negative numbers.',
        },
        pathType: {
            value: this.pathType,
            from: PathType,
            displayName: 'How path moves about grid',
            required: false,
        },
        formula: {
            value: this.formula,
            from: Formula,
            displayName: 'Formula',
            required: false,
        },
        resetAndAugmentByOne: {
            value: this.resetAndAugmentByOne,
            forceType: 'boolean',
            displayName: 'Values reset augmented by one each row.',
            required: false,
            description:
                'Note: Selecting this setting set the path type to Rows.',
        },
        visualInfo: {
            value: this.visualInfo,
            from: VisualInfo,
            displayName: 'Show path or numbers',
            required: false,
            description:
                'Note: Show_Path defaults to 1,000 numbers, and Show_Numbers defaults to 400 numbers',
        },
        backgroundColor: {
            value: this.backgroundColor,
            forceType: 'color',
            displayName: 'Background color:',
            required: false,
        },
        property1: {
            value: this.property1,
            from: Property,
            displayName: 'Property 1',
            required: false,
        },
        property1Visualization: {
            value: this.property1Visualization,
            from: PropertyVisualization,
            displayName: 'Property 1 Visualization',
            required: false,
        },
        property1Color: {
            value: this.property1MainColor,
            forceType: 'color',
            displayName: 'Property 1 color:',
            required: false,
            visibleDependency: 'property1Visualization',
            visibleValue: PropertyVisualization.Color,
        },
        property2: {
            value: this.property2,
            from: Property,
            displayName: 'Property 2',
            required: false,
        },
        property2Visualization: {
            value: this.property2Visualization,
            from: PropertyVisualization,
            displayName: 'Property 2 Visualization',
            required: false,
        },
        property2Color: {
            value: this.property2MainColor,
            forceType: 'color',
            displayName: 'Property 2 color:',
            required: false,
            visibleDependency: 'property2Visualization',
            visibleValue: PropertyVisualization.Color,
        },
        property3: {
            value: this.property3,
            from: Property,
            displayName: 'Property 3',
            required: false,
        },
        property3Visualization: {
            value: this.property3Visualization,
            from: PropertyVisualization,
            displayName: 'Property 3 Visualization',
            required: false,
        },
        property3Color: {
            value: this.property3MainColor,
            forceType: 'color',
            displayName: 'Property 3 color:',
            required: false,
            visibleDependency: 'property3Visualization',
            visibleValue: PropertyVisualization.Color,
        },
        property4: {
            value: this.property4,
            from: Property,
            displayName: 'Property 4',
            required: false,
        },
        property4Visualization: {
            value: this.property4Visualization,
            from: PropertyVisualization,
            displayName: 'Property 4 Visualization',
            required: false,
        },
        property4Color: {
            value: this.property4MainColor,
            forceType: 'color',
            displayName: 'Property 4 color:',
            required: false,
            visibleDependency: 'property4Visualization',
            visibleValue: PropertyVisualization.Color,
        },
        property5: {
            value: this.property5,
            from: Property,
            displayName: 'Property 5',
            required: false,
        },
        property5Visualization: {
            value: this.property5Visualization,
            from: PropertyVisualization,
            displayName: 'Property 5 Visualization',
            required: false,
        },
        property5Color: {
            value: this.property5MainColor,
            forceType: 'color',
            displayName: 'Property 5 color:',
            required: false,
            visibleDependency: 'property5Visualization',
            visibleValue: PropertyVisualization.Color,
        },
        property6: {
            value: this.property6,
            from: Property,
            displayName: 'Property 6',
            required: false,
        },
        property6Visualization: {
            value: this.property6Visualization,
            from: PropertyVisualization,
            displayName: 'Property 6 Visualization',
            required: false,
        },
        property6Color: {
            value: this.property6MainColor,
            forceType: 'color',
            displayName: 'Property 6 color:',
            required: false,
            visibleDependency: 'property6Visualization',
            visibleValue: PropertyVisualization.Color,
        },
        /*
        property7: {
            value: this.property7,
            from: Property,
            displayName: 'Property 7',
            required: false,
        },
        property7Visualization: {
            value: this.property7Visualization,
            from: PropertyVisualization,
            displayName: 'Property 7 Visualization',
            required: false,
        },
        property7Color: {
            value: this.property7MainColor,
            forceType: 'color',
            displayName: 'Property 7 color:',
            required: false,
            visibleDependency: 'property7Visualization',
            visibleValue: PropertyVisualization.Color,
        },
        property8: {
            value: this.property8,
            from: Property,
            displayName: 'Property 8',
            required: false,
        },
        property8Visualization: {
            value: this.property8Visualization,
            from: PropertyVisualization,
            displayName: 'Property 8 Visualization',
            required: false,
        },
        property8Color: {
            value: this.property8MainColor,
            forceType: 'color',
            displayName: 'Property 8 color:',
            required: false,
            visibleDependency: 'property8Visualization',
            visibleValue: PropertyVisualization.Color,
        },
        property9: {
            value: this.property9,
            from: Property,
            displayName: 'Property 9',
            required: false,
        },
        property9Visualization: {
            value: this.property9Visualization,
            from: PropertyVisualization,
            displayName: 'Property 9 Visualization',
            required: false,
        },
        property9Color: {
            value: this.property9MainColor,
            forceType: 'color',
            displayName: 'Property 9 color:',
            required: false,
            visibleDependency: 'property9Visualization',
            visibleValue: PropertyVisualization.Color,
        },
        property10: {
            value: this.property10,
            from: Property,
            displayName: 'Property 10',
            required: false,
        },
        property10Visualization: {
            value: this.property10Visualization,
            from: PropertyVisualization,
            displayName: 'Property 10 Visualization',
            required: false,
        },
        property10Color: {
            value: this.property10MainColor,
            forceType: 'color',
            displayName: 'Property 10 color:',
            required: false,
            visibleDependency: 'property10Visualization',
            visibleValue: PropertyVisualization.Color,
        },
        property11: {
            value: this.property11,
            from: Property,
            displayName: 'Property 11',
            required: false,
        },
        property11Visualization: {
            value: this.property11Visualization,
            from: PropertyVisualization,
            displayName: 'Property 11 Visualization',
            required: false,
        },
        property11Color: {
            value: this.property11MainColor,
            forceType: 'color',
            displayName: 'Property 11 color:',
            required: false,
            visibleDependency: 'property11Visualization',
            visibleValue: PropertyVisualization.Color,
        },
        property12: {
            value: this.property12,
            from: Property,
            displayName: 'Property 12',
            required: false,
        },
        property12Visualization: {
            value: this.property12Visualization,
            from: PropertyVisualization,
            displayName: 'Property 12 Visualization',
            required: false,
        },
        property12Color: {
            value: this.property12MainColor,
            forceType: 'color',
            displayName: 'Property 12 color:',
            required: false,
            visibleDependency: 'property12Visualization',
            visibleValue: PropertyVisualization.Color,
        },
        */
    }

    checkParameters() {
        const status = super.checkParameters()
        if (typeof this.message !== 'string') {
            status.isValid = false
            status.errors.push('message must be a string')
        }

        return status
    }
    setup(): void {
        this.sketch.createCanvas(400, 400)
    }

    draw(): void {
        if (
            this.property1 != Property.None
            || this.property2 != Property.None
            || this.property3 != Property.None
            || this.property4 != Property.None
            || this.property5 != Property.None
            || this.property6 != Property.None
            || this.property7 != Property.None
            || this.property8 != Property.None
            || this.property9 != Property.None
            || this.property10 != Property.None
            || this.property11 != Property.None
            || this.property12 != Property.None
        ) {
            this.preset = Preset.None
        }

        if (this.preset == Preset.Primes) {
            this.backgroundColor = BLACK
            this.property1 = Property.Prime
            this.property1Visualization = PropertyVisualization.Color
            this.property1MainColor = RED
        } else if (this.preset == Preset.Abundant_Numbers) {
            this.backgroundColor = WHITE
            this.property1 = Property.Abundant
            this.property1Visualization = PropertyVisualization.Color
            this.property1MainColor = BLACK
        } else if (this.preset == Preset.Abundant_Numbers_And_Primes) {
            this.backgroundColor = WHITE
            this.property1 = Property.Abundant
            this.property1Visualization = PropertyVisualization.Color
            this.property1MainColor = BLACK
            this.property2 = Property.Prime
            this.property2Visualization = PropertyVisualization.Color
            this.property2MainColor = RED
        } else if (
            this.preset == Preset.Polygonal_Numbers_Without_Square_Numbers
        ) {
            this.backgroundColor = BLACK
            this.property1 = Property.Triangular_Number
            this.property1Visualization = PropertyVisualization.Color
            this.property1MainColor = RED
            this.property2 = Property.Pentagonal_Number
            this.property2Visualization = PropertyVisualization.Color
            this.property2MainColor = ORANGE
            this.property3 = Property.Hexagonal_Number
            this.property3Visualization = PropertyVisualization.Color
            this.property3MainColor = GREEN
            this.property4 = Property.Heptagonal_Number
            this.property4Visualization = PropertyVisualization.Color
            this.property4MainColor = BLUE
            this.property5 = Property.Octagonal_Number
            this.property5Visualization = PropertyVisualization.Color
            this.property5MainColor = PURPLE
        } else if (
            this.preset == Preset.Polygonal_Numbers_With_Square_Numbers
        ) {
            this.backgroundColor = BLACK
            this.property1 = Property.Triangular_Number
            this.property1Visualization = PropertyVisualization.Color
            this.property1MainColor = RED
            this.property2 = Property.Square_Number
            this.property2Visualization = PropertyVisualization.Color
            this.property2MainColor = ORANGE
            this.property3 = Property.Pentagonal_Number
            this.property3Visualization = PropertyVisualization.Color
            this.property3MainColor = YELLOW
            this.property4 = Property.Hexagonal_Number
            this.property4Visualization = PropertyVisualization.Color
            this.property4MainColor = GREEN
            this.property5 = Property.Heptagonal_Number
            this.property5Visualization = PropertyVisualization.Color
            this.property5MainColor = BLUE
            this.property6 = Property.Octagonal_Number
            this.property6Visualization = PropertyVisualization.Color
            this.property6MainColor = PURPLE
        }

        this.sketch.strokeWeight(0)

        if (this.resetAndAugmentByOne) {
            this.pathType = PathType.Rows
        }

        if (
            this.visualInfo == VisualInfo.Show_Numbers
            && this.amountOfNumbers > 400
        ) {
            this.amountOfNumbers = 400
        }
        if (
            this.visualInfo == VisualInfo.Show_Path
            && this.amountOfNumbers > 1000
        ) {
            this.amountOfNumbers = 1000
        }

        if (
            this.formula == Formula.TWO_TO_THE_N
            && this.amountOfNumbers > 1000
        ) {
            this.amountOfNumbers = 1000
        }

        //Round up amount of numbers so that it is a square number.
        const squareRootOfAmountOfNumbers = ceil(sqrt(this.amountOfNumbers))
        this.amountOfNumbers =
            squareRootOfAmountOfNumbers * squareRootOfAmountOfNumbers

        //Calculate scaling factor
        const scalingFactor = 400 / squareRootOfAmountOfNumbers //This is because 20 x 20 is 1:1 scaling.

        //Set path variables
        setPathVariables(this, squareRootOfAmountOfNumbers, scalingFactor)

        let actualCurrentIndex = this.startingIndex - 1
        let augmentForSequence = 0

        for (
            let currentIndex = 0;
            currentIndex < this.amountOfNumbers;
            currentIndex++
        ) {
            actualCurrentIndex++

            if (currentDirection == 'startNewRow') {
                if (this.resetAndAugmentByOne) {
                    actualCurrentIndex = this.startingIndex
                    augmentForSequence++
                }
            }

            let sequenceElementAsNumber = -1
            if (this.formula == Formula.N) {
                sequenceElementAsNumber =
                    Number(this.seq.getElement(actualCurrentIndex))
                    + augmentForSequence
            } else if (this.formula == Formula.N_SQUARED) {
                sequenceElementAsNumber = Number(
                    this.seq.getElement(actualCurrentIndex)
                )
                sequenceElementAsNumber =
                    sequenceElementAsNumber * sequenceElementAsNumber
                    + augmentForSequence
            } else if (this.formula == Formula.N_SQUARED_PLUS_1) {
                sequenceElementAsNumber = Number(
                    this.seq.getElement(actualCurrentIndex)
                )
                sequenceElementAsNumber =
                    sequenceElementAsNumber * sequenceElementAsNumber
                    + augmentForSequence
                    + 1
            } else if (this.formula == Formula.N_SQUARED_MINUS_N) {
                sequenceElementAsNumber = Number(
                    this.seq.getElement(actualCurrentIndex)
                )
                sequenceElementAsNumber =
                    sequenceElementAsNumber * sequenceElementAsNumber
                    - sequenceElementAsNumber
                    + augmentForSequence
            } else if (this.formula == Formula.N_SQUARED_MINUS_N_PLUS_1) {
                sequenceElementAsNumber = Number(
                    this.seq.getElement(actualCurrentIndex)
                )
                sequenceElementAsNumber =
                    sequenceElementAsNumber * sequenceElementAsNumber
                    + sequenceElementAsNumber
                    + augmentForSequence
                    + 1
            } else if (this.formula == Formula.TWO_N_SQUARED) {
                sequenceElementAsNumber = Number(
                    this.seq.getElement(actualCurrentIndex)
                )
                sequenceElementAsNumber =
                    2 * sequenceElementAsNumber * sequenceElementAsNumber
                    + augmentForSequence
            } else if (this.formula == Formula.THREE_N_SQUARED) {
                sequenceElementAsNumber = Number(
                    this.seq.getElement(actualCurrentIndex)
                )
                sequenceElementAsNumber =
                    3 * sequenceElementAsNumber * sequenceElementAsNumber
                    + augmentForSequence
            } else if (this.formula == Formula.N_CUBED) {
                sequenceElementAsNumber = Number(
                    this.seq.getElement(actualCurrentIndex)
                )
                sequenceElementAsNumber =
                    sequenceElementAsNumber
                        * sequenceElementAsNumber
                        * sequenceElementAsNumber
                    + augmentForSequence
            } else if (this.formula == Formula.N_CUBED_PLUS_N_SQUARED) {
                sequenceElementAsNumber = Number(
                    this.seq.getElement(actualCurrentIndex)
                )
                sequenceElementAsNumber =
                    sequenceElementAsNumber
                        * sequenceElementAsNumber
                        * sequenceElementAsNumber
                    + sequenceElementAsNumber * sequenceElementAsNumber
                    + augmentForSequence
            } else if (
                this.formula == Formula.N_CUBED_PLUS_N_SQUARED_PLUS_N
            ) {
                sequenceElementAsNumber = Number(
                    this.seq.getElement(actualCurrentIndex)
                )
                sequenceElementAsNumber =
                    sequenceElementAsNumber
                        * sequenceElementAsNumber
                        * sequenceElementAsNumber
                    + sequenceElementAsNumber * sequenceElementAsNumber
                    + sequenceElementAsNumber
                    + augmentForSequence
            } else if (this.formula == Formula.TWO_TO_THE_N) {
                sequenceElementAsNumber = Number(
                    this.seq.getElement(actualCurrentIndex)
                )
                sequenceElementAsNumber =
                    Math.pow(2, sequenceElementAsNumber) + augmentForSequence
            }

            //Get sequence element as BigInt
            const sequenceElementAsString = sequenceElementAsNumber.toString()

            //Set color for square
            setColorForSquare(this.preset, sequenceElementAsNumber, this)

            //Draw square
            this.sketch.rect(x, y, scalingFactor, scalingFactor)

            //Show numbers
            if (this.visualInfo == VisualInfo.Show_Numbers) {
                this.sketch.fill(WHITE)
                this.sketch.text(
                    sequenceElementAsString,
                    x + 0 * scalingFactor,
                    y + (15 / 20) * scalingFactor
                )
            }

            //Save current direction before changing direction
            const previousDirection = currentDirection

            //Change direction
            changeDirectionBasedOnPathType(
                this,
                squareRootOfAmountOfNumbers,
                this.amountOfNumbers,
                currentIndex
            )

            //Draw path
            if (this.visualInfo == VisualInfo.Show_Path) {
                showPath(
                    this,
                    currentIndex,
                    previousDirection,
                    currentDirection,
                    scalingFactor
                )
            }

            //Move coordinates
            moveCoordinatesBasedOnDirection(currentDirection, scalingFactor)
        }
        this.sketch.noLoop()
    }
}
export const exportModule = new VisualizerExportModule(
    'Spiral',
    VisualizerSpiral,
    'Displays a message to the viewer.'
)

function setPathVariables(
    visualizer: VisualizerSpiral,
    squareRootOfAmountOfNumbers: number,
    scalingFactor: number
) {
    //Declare initial movement variables.
    if (
        visualizer.pathType == PathType.Inwards_Spiral
        || visualizer.pathType == PathType.Rows
    ) {
        //These all start in the top left corner
        x = 0
        y = 0
    } else if (visualizer.pathType == PathType.Spiral) {
        //This starts at different places in the center so that the whole spiral is centered
        if (squareRootOfAmountOfNumbers % 2 == 1) {
            x = (floor(squareRootOfAmountOfNumbers / 2) - 1) * scalingFactor
            y = floor(squareRootOfAmountOfNumbers / 2) * scalingFactor
        } else {
            x = (floor(squareRootOfAmountOfNumbers / 2) - 1) * scalingFactor
            y = floor(squareRootOfAmountOfNumbers / 2) * scalingFactor
        }
    }

    if (visualizer.pathType == PathType.Spiral) {
        //This uses an increment that decreases every other time the spiral turns
        numberToTurnAt = 1
        incrementForNumberToTurnAt = 1
        currentDirection = 'right'
        whetherIncrementShouldIncrementForSpiral = true
    } else if (visualizer.pathType == PathType.Inwards_Spiral) {
        //This uses an increment that increases every other time the spiral turns
        numberToTurnAt = squareRootOfAmountOfNumbers - 1
        incrementForNumberToTurnAt = squareRootOfAmountOfNumbers - 1
        currentDirection = 'right'
        whetherIncrementShouldIncrementForSpiral = false
    }
}

function changeDirectionBasedOnPathType(
    visualizer: VisualizerSpiral,
    squareRootOfAmountOfNumbers: number,
    amountOfNumbers: number,
    currentIndex: number
) {
    //Choose direction for next number
    if (visualizer.pathType == PathType.Spiral) {
        if (currentIndex == numberToTurnAt) {
            numberToTurnAt += incrementForNumberToTurnAt
            if (whetherIncrementShouldIncrementForSpiral) {
                incrementForNumberToTurnAt += 1
                whetherIncrementShouldIncrementForSpiral = false
            } else {
                whetherIncrementShouldIncrementForSpiral = true
            }

            if (currentDirection == 'right') {
                currentDirection = 'up'
            } else if (currentDirection == 'up') {
                currentDirection = 'left'
            } else if (currentDirection == 'left') {
                currentDirection = 'down'
            } else if (currentDirection == 'down') {
                currentDirection = 'right'
            }
        }
    } else if (visualizer.pathType == PathType.Inwards_Spiral) {
        if (currentIndex == numberToTurnAt) {
            numberToTurnAt += incrementForNumberToTurnAt
            if (whetherIncrementShouldIncrementForSpiral) {
                incrementForNumberToTurnAt -= 1
                whetherIncrementShouldIncrementForSpiral = false
            } else {
                whetherIncrementShouldIncrementForSpiral = true
            }

            if (currentDirection == 'right') {
                currentDirection = 'down'
            } else if (currentDirection == 'down') {
                currentDirection = 'left'
            } else if (currentDirection == 'left') {
                currentDirection = 'up'
            } else if (currentDirection == 'up') {
                currentDirection = 'right'
            }
        }
    } else if (visualizer.pathType == PathType.Rows) {
        //Go to new row when the row is complete
        if ((currentIndex + 1) % squareRootOfAmountOfNumbers == 0) {
            currentDirection = 'startNewRow'
        } else if (currentIndex == amountOfNumbers) {
            currentDirection = 'none'
        } else {
            currentDirection = 'right'
        }
    }
}

function showPath(
    visualizer: VisualizerSpiral,
    currentIndex: number,
    previousDirection: string,
    currentDirection: string,
    scalingFactor: number
) {
    visualizer.sketch.fill(WHITE)

    if (currentIndex != 0) {
        if (previousDirection == 'left') {
            visualizer.sketch.rect(
                x + ((10 - 2) / 20) * scalingFactor,
                y + ((10 - 2) / 20) * scalingFactor,
                ((20 + 2 + 2) / 20) * scalingFactor,
                (4 / 20) * scalingFactor
            )
        } else if (
            previousDirection == 'down'
            || previousDirection == 'downBeforeLeft'
            || previousDirection == 'downBeforeRight'
        ) {
            visualizer.sketch.rect(
                x + ((10 - 2) / 20) * scalingFactor,
                y + ((10 - 22) / 20) * scalingFactor,
                (4 / 20) * scalingFactor,
                ((20 + 2 + 2) / 20) * scalingFactor
            )
        } else if (previousDirection == 'right') {
            visualizer.sketch.rect(
                x + ((10 - 22) / 20) * scalingFactor,
                y + ((10 - 2) / 20) * scalingFactor,
                ((20 + 2 + 2) / 20) * scalingFactor,
                (4 / 20) * scalingFactor
            )
        } else if (previousDirection == 'up') {
            visualizer.sketch.rect(
                x + ((10 - 2) / 20) * scalingFactor,
                y + ((10 - 2) / 20) * scalingFactor,
                (4 / 20) * scalingFactor,
                ((20 + 2 + 2) / 20) * scalingFactor
            )
        } else {
            visualizer.sketch.rect(
                x + ((10 - 2) / 20) * scalingFactor,
                y + ((10 - 2) / 20) * scalingFactor,
                (4 / 20) * scalingFactor,
                (4 / 20) * scalingFactor
            )
        }
    }

    if (currentDirection == 'right') {
        visualizer.sketch.rect(
            x + ((10 - 2) / 20) * scalingFactor,
            y + ((10 - 2) / 20) * scalingFactor,
            ((20 + 2 + 2) / 20) * scalingFactor,
            (4 / 20) * scalingFactor
        )
    } else if (currentDirection == 'up') {
        visualizer.sketch.rect(
            x + ((10 - 2) / 20) * scalingFactor,
            y + ((10 - 22) / 20) * scalingFactor,
            (4 / 20) * scalingFactor,
            ((20 + 2 + 2) / 20) * scalingFactor
        )
    } else if (currentDirection == 'left') {
        visualizer.sketch.rect(
            x + ((10 - 22) / 20) * scalingFactor,
            y + ((10 - 2) / 20) * scalingFactor,
            ((20 + 2 + 2) / 20) * scalingFactor,
            (4 / 20) * scalingFactor
        )
    } else if (
        currentDirection == 'down'
        || currentDirection == 'downBeforeLeft'
        || currentDirection == 'downBeforeRight'
    ) {
        visualizer.sketch.rect(
            x + ((10 - 2) / 20) * scalingFactor,
            y + ((10 - 2) / 20) * scalingFactor,
            (4 / 20) * scalingFactor,
            ((20 + 2 + 2) / 20) * scalingFactor
        )
    } else {
        visualizer.sketch.rect(
            x + ((10 - 2) / 20) * scalingFactor,
            y + ((10 - 2) / 20) * scalingFactor,
            (4 / 20) * scalingFactor,
            (4 / 20) * scalingFactor
        )
    }
}

function moveCoordinatesBasedOnDirection(
    direction: string,
    scalingFactor: number
) {
    //Move coordinates to direction they're going to
    if (currentDirection == 'right') {
        x += scalingFactor
    } else if (currentDirection == 'up') {
        y -= scalingFactor
    } else if (currentDirection == 'left') {
        x -= scalingFactor
    } else if (
        currentDirection == 'down'
        || currentDirection == 'downBeforeLeft'
        || currentDirection == 'downBeforeRight'
    ) {
        y += scalingFactor
    } else if (currentDirection == 'startNewRow') {
        x = 0
        y += scalingFactor
    }
}

function setColorForSquare(
    preset: Preset,
    sequenceElementAsNumber: number,
    visualizer: VisualizerSpiral
) {
    //Color number
    colorGradients(preset, sequenceElementAsNumber, visualizer)

    if (
        visualizer.property1 != Property.None
        && visualizer.property1Visualization == PropertyVisualization.Color
    ) {
        if (hasProperty(sequenceElementAsNumber, visualizer.property1)) {
            visualizer.sketch.fill(visualizer.property1MainColor)
        }
    }
    if (
        visualizer.property2 != Property.None
        && visualizer.property2Visualization == PropertyVisualization.Color
    ) {
        if (hasProperty(sequenceElementAsNumber, visualizer.property2)) {
            visualizer.sketch.fill(visualizer.property2MainColor)
        }
    }
    if (
        visualizer.property3 != Property.None
        && visualizer.property3Visualization == PropertyVisualization.Color
    ) {
        if (hasProperty(sequenceElementAsNumber, visualizer.property3)) {
            visualizer.sketch.fill(visualizer.property3MainColor)
        }
    }
    if (
        visualizer.property4 != Property.None
        && visualizer.property4Visualization == PropertyVisualization.Color
    ) {
        if (hasProperty(sequenceElementAsNumber, visualizer.property4)) {
            visualizer.sketch.fill(visualizer.property4MainColor)
        }
    }
    if (
        visualizer.property5 != Property.None
        && visualizer.property5Visualization == PropertyVisualization.Color
    ) {
        if (hasProperty(sequenceElementAsNumber, visualizer.property5)) {
            visualizer.sketch.fill(visualizer.property5MainColor)
        }
    }
    if (
        visualizer.property6 != Property.None
        && visualizer.property6Visualization == PropertyVisualization.Color
    ) {
        if (hasProperty(sequenceElementAsNumber, visualizer.property6)) {
            visualizer.sketch.fill(visualizer.property6MainColor)
        }
    }
    if (
        visualizer.property7 != Property.None
        && visualizer.property7Visualization == PropertyVisualization.Color
    ) {
        if (hasProperty(sequenceElementAsNumber, visualizer.property7)) {
            visualizer.sketch.fill(visualizer.property7MainColor)
        }
    }
    if (
        visualizer.property8 != Property.None
        && visualizer.property8Visualization == PropertyVisualization.Color
    ) {
        if (hasProperty(sequenceElementAsNumber, visualizer.property8)) {
            visualizer.sketch.fill(visualizer.property8MainColor)
        }
    }
    if (
        visualizer.property9 != Property.None
        && visualizer.property9Visualization == PropertyVisualization.Color
    ) {
        if (hasProperty(sequenceElementAsNumber, visualizer.property9)) {
            visualizer.sketch.fill(visualizer.property9MainColor)
        }
    }
    if (
        visualizer.property10 != Property.None
        && visualizer.property10Visualization == PropertyVisualization.Color
    ) {
        if (hasProperty(sequenceElementAsNumber, visualizer.property10)) {
            visualizer.sketch.fill(visualizer.property10MainColor)
        }
    }
    if (
        visualizer.property11 != Property.None
        && visualizer.property11Visualization == PropertyVisualization.Color
    ) {
        if (hasProperty(sequenceElementAsNumber, visualizer.property11)) {
            visualizer.sketch.fill(visualizer.property11MainColor)
        }
    }
    if (
        visualizer.property12 != Property.None
        && visualizer.property12Visualization == PropertyVisualization.Color
    ) {
        if (hasProperty(sequenceElementAsNumber, visualizer.property12)) {
            visualizer.sketch.fill(visualizer.property12MainColor)
        }
    }
}
function colorGradients(
    preset: Preset,
    sequenceElementAsNumber: number,
    visualizer: VisualizerSpiral
) {
    if (preset == Preset.Factors) {
        var numberOfFactors = getNumberOfFactors(sequenceElementAsNumber)

        if (numberOfFactors == 2) {
            visualizer.sketch.fill(SHADE0)
        } else if (numberOfFactors == 3) {
            visualizer.sketch.fill(SHADE1)
        } else if (numberOfFactors == 4) {
            visualizer.sketch.fill(SHADE2)
        } else if (numberOfFactors == 5) {
            visualizer.sketch.fill(SHADE3)
        } else if (numberOfFactors == 6) {
            visualizer.sketch.fill(SHADE4)
        } else if (numberOfFactors == 7) {
            visualizer.sketch.fill(SHADE5)
        } else if (numberOfFactors == 8) {
            visualizer.sketch.fill(SHADE6)
        } else if (numberOfFactors == 9) {
            visualizer.sketch.fill(SHADE7)
        } else if (numberOfFactors == 10) {
            visualizer.sketch.fill(SHADE8)
        } else if (numberOfFactors == 11) {
            visualizer.sketch.fill(SHADE9)
        } else if (numberOfFactors == 12) {
            visualizer.sketch.fill(SHADE10)
        } else if (numberOfFactors == 13) {
            visualizer.sketch.fill(SHADE11)
        } else if (numberOfFactors == 14) {
            visualizer.sketch.fill(SHADE12)
        } else if (numberOfFactors == 15) {
            visualizer.sketch.fill(SHADE13)
        } else {
            visualizer.sketch.fill(SHADE13)
        }
    } else if (preset == Preset.Factors_and_Primes) {
        var numberOfFactors = getNumberOfFactors(sequenceElementAsNumber)

        if (isPrime(sequenceElementAsNumber)) {
            visualizer.sketch.fill(HIGHLIGHT)
        } else if (numberOfFactors == 3) {
            visualizer.sketch.fill(SHADE0)
        } else if (numberOfFactors == 4) {
            visualizer.sketch.fill(SHADE1)
        } else if (numberOfFactors == 5) {
            visualizer.sketch.fill(SHADE2)
        } else if (numberOfFactors == 6) {
            visualizer.sketch.fill(SHADE3)
        } else if (numberOfFactors == 7) {
            visualizer.sketch.fill(SHADE4)
        } else if (numberOfFactors == 8) {
            visualizer.sketch.fill(SHADE5)
        } else if (numberOfFactors == 9) {
            visualizer.sketch.fill(SHADE6)
        } else if (numberOfFactors == 10) {
            visualizer.sketch.fill(SHADE7)
        } else if (numberOfFactors == 11) {
            visualizer.sketch.fill(SHADE8)
        } else if (numberOfFactors == 12) {
            visualizer.sketch.fill(SHADE9)
        } else if (numberOfFactors == 13) {
            visualizer.sketch.fill(SHADE10)
        } else if (numberOfFactors == 14) {
            visualizer.sketch.fill(SHADE11)
        } else if (numberOfFactors == 15) {
            visualizer.sketch.fill(SHADE12)
        } else if (numberOfFactors == 16) {
            visualizer.sketch.fill(SHADE13)
        } else {
            visualizer.sketch.fill(SHADE13)
        }
    } else if (preset == Preset.Divisibility) {
        if (sequenceElementAsNumber == 0 || sequenceElementAsNumber == 1) {
            visualizer.sketch.fill(SHADE0)
        } else if (sequenceElementAsNumber % 2 == 0) {
            visualizer.sketch.fill(SHADE0)
        } else if (sequenceElementAsNumber % 3 == 0) {
            visualizer.sketch.fill(SHADE1)
        } else if (sequenceElementAsNumber % 5 == 0) {
            visualizer.sketch.fill(SHADE2)
        } else if (sequenceElementAsNumber % 7 == 0) {
            visualizer.sketch.fill(SHADE3)
        } else if (sequenceElementAsNumber % 11 == 0) {
            visualizer.sketch.fill(SHADE4)
        } else if (sequenceElementAsNumber % 13 == 0) {
            visualizer.sketch.fill(SHADE5)
        } else if (sequenceElementAsNumber % 17 == 0) {
            visualizer.sketch.fill(SHADE6)
        } else if (sequenceElementAsNumber % 19 == 0) {
            visualizer.sketch.fill(SHADE7)
        } else if (sequenceElementAsNumber % 23 == 0) {
            visualizer.sketch.fill(SHADE8)
        } else if (sequenceElementAsNumber % 29 == 0) {
            visualizer.sketch.fill(SHADE9)
        } else if (sequenceElementAsNumber % 31 == 0) {
            visualizer.sketch.fill(SHADE10)
        } else if (sequenceElementAsNumber % 37 == 0) {
            visualizer.sketch.fill(SHADE11)
        } else if (sequenceElementAsNumber % 41 == 0) {
            visualizer.sketch.fill(SHADE12)
        } else if (isPrime(sequenceElementAsNumber)) {
            visualizer.sketch.fill(SHADE13)
        } else {
            visualizer.sketch.fill(SHADE13)
        }
    } else {
        visualizer.sketch.fill(visualizer.backgroundColor)
    }
}

function hasProperty(num: number, property: Property) {
    if (property == Property.Prime) {
        return isPrime(num)
    } else if (property == Property.Even) {
        return num % 2 == 0
    } else if (property == Property.Divisible_ByThree) {
        return num % 3 == 0
    } else if (property == Property.Negative) {
        return num < 0
    } else if (property == Property.Sum_Of_Two_Squares) {
        return isSumOfTwoSquares(num)
    } else if (property == Property.Fibonacci_Number) {
        return isFibonacciNumber(num)
    } else if (property == Property.Lucas_Number) {
        return isLucasNumber(num)
    } else if (property == Property.Triangular_Number) {
        return isPolygonal(num, 3)
    } else if (property == Property.Square_Number) {
        return isPolygonal(num, 4)
    } else if (property == Property.Pentagonal_Number) {
        return isPolygonal(num, 5)
    } else if (property == Property.Hexagonal_Number) {
        return isPolygonal(num, 6)
    } else if (property == Property.Heptagonal_Number) {
        return isPolygonal(num, 7)
    } else if (property == Property.Octagonal_Number) {
        return isPolygonal(num, 8)
    } else if (property == Property.Abundant) {
        return isAbundant(num)
    } else if (property == Property.Perfect) {
        return isPerfect(num)
    } else if (property == Property.Deficient) {
        return !isPerfect(num) && !isAbundant(num)
    } else if (property == Property.Semi_Prime) {
        return isSemiPrime(num)
    }
    return false
}

//Code taken from Stack Overflow : https://stackoverflow.com/questions/40200089/number-prime-test-in-javascript
//This should be replaced with the getFactors implementation specifically for Numberscope.
function isPrime(num: number) {
    if (num == 0 || num == 1) {
        return false
    }

    for (
        let currentIndex = 2, s = Math.sqrt(num);
        currentIndex <= s;
        currentIndex++
    )
        if (num % currentIndex === 0) return false
    return num > 1
}

//Code taken from Stack Overflow : https://stackoverflow.com/questions/22130043/trying-to-find-factors-of-a-number-in-js
//This should be replaced with the getFactors implementation specifically for Numberscope.
function getNumberOfFactors(num: number) {
    if (num == 0) {
        return 2
    }

    if (num == 1) {
        return 2
    }

    const isEven = num % 2 === 0
    const max = Math.sqrt(num)
    const inc = isEven ? 1 : 2
    const factors = [1, num]

    for (let curFactor = isEven ? 2 : 3; curFactor <= max; curFactor += inc) {
        if (num % curFactor !== 0) continue
        factors.push(curFactor)
        const compliment = num / curFactor
        if (compliment !== curFactor) factors.push(compliment)
    }

    return factors.length
}

//Taken from Geeks For Geeks : https://www.geeksforgeeks.org/deficient-number/
function divisorsSum(num: number) {
    let sum = 0 // Initialize sum of prime factors

    // Note that this loop runs till square root of n
    for (let i = 1; i <= Math.sqrt(num); i++) {
        if (num % i == 0) {
            // If divisors are equal, take only one
            // of them
            if (num / i == i) {
                sum = sum + i
            } // Otherwise take both
            else {
                sum = sum + i
                sum = sum + num / i
            }
        }
    }

    return sum
}

function isSumOfTwoSquares(num: number) {
    for (let i = 1; i * i <= num; i++) {
        for (let j = 1; j * j <= num; j++)
            if (i * i + j * j == num) {
                return true
            }
    }
}

function isFibonacciNumber(num: number) {
    for (
        let currentIndex = 0;
        currentIndex < FIBONACCI_SEQUENCE.length;
        currentIndex++
    ) {
        if (num == FIBONACCI_SEQUENCE[currentIndex]) {
            return true
        }
    }

    return false
}

function isLucasNumber(num: number) {
    for (
        let currentIndex = 0;
        currentIndex < LUCAS_SEQUENCE.length;
        currentIndex++
    ) {
        if (num == LUCAS_SEQUENCE[currentIndex]) {
            return true
        }
    }

    return false
}

//Modification of Geeks for Geeks : https://www.geeksforgeeks.org/program-check-n-pentagonal-number/
function isPolygonal(num: number, order: number) {
    let i = 1,
        M
    do {
        // Substitute values of
        // i in the formula.
        M = (order - 2) * ((i * (i - 1)) / 2) + i
        i += 1
    } while (M < num)
    return M == num
}

//Taken from Geeks For Geeks : https://www.geeksforgeeks.org/deficient-number/
function isAbundant(num: number) {
    // Check if sum(n) < 2 * n
    return divisorsSum(num) > 2 * num
}

function isPerfect(num: number) {
    // To store sum of divisors
    let sum = 1

    // Find all divisors and add them
    for (let i = 2; i * i <= num; i++) {
        if (num % i == 0) {
            if (i * i != num) sum = sum + i + num / i
            else sum = sum + i
        }
    }
    // If sum of divisors is equal to
    // n, then n is a perfect number
    if (sum == num && num != 1) return true

    return false
}

//Taken from Geeks for Geeks: https://www.geeksforgeeks.org/check-whether-number-semiprime-not/
function isSemiPrime(num: number) {
    let cnt = 0
    for (let i = 2; cnt < 2 && i * i <= num; ++i)
        while (num % i == 0) {
            num /= i // Increment count // of prime numbers
            ++cnt
        } // If number is greater than 1, // add it to the count variable // as it indicates the number // remain is prime number
    if (num > 1) ++cnt // Return '1' if count is equal // to '2' else return '0'
    return cnt == 2 ? 1 : 0
}