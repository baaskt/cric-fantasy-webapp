import React from 'react'
import { MatchDetailEntity } from '@/model/response/match-detail.interface'
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import BattingCard from './BattingCard'
import ScoreHeader from './ScoreHeader'
import BowlingCard from './BowlingCard'
import { COLORS } from '@/util/colors'
import POMCard from './POMCard'

type ScoreCardProps = {
  scoreCardData: MatchDetailEntity
}

function ScoreCard(props: ScoreCardProps) {
  const { scoreCardData } = props
  const inningsOne = scoreCardData.inningsOne
  const inningsTwo = scoreCardData.inningsTwo
  const isInnings1Won = inningsOne.score.runs > inningsTwo.score.runs ? true : false

  return (
    <div className='flex justify-around text-sm flex-col md:flex-row md:text-lg md:p-5'>
      <div>
        <Accordion>
          <AccordionSummary
            sx={{
              backgroundColor:
                isInnings1Won && scoreCardData.isMatchComplete ? COLORS.cricPrimary : COLORS.white,
              color:
                isInnings1Won && scoreCardData.isMatchComplete ? COLORS.white : COLORS.cricDark,
            }}
            expandIcon={
              <ExpandMoreIcon
                sx={{
                  color:
                    isInnings1Won && scoreCardData.isMatchComplete ? COLORS.white : COLORS.cricDark,
                }}
              />
            }
            aria-controls='inningsOne'
            id='inningsOne'
          >
            <ScoreHeader
              isInnings2={false}
              teamName={inningsOne.battingTeam}
              score={inningsOne.score}
              status={scoreCardData.status}
              isMatchComplete={scoreCardData.isMatchComplete}
              isVictory={isInnings1Won}
            />
          </AccordionSummary>
          <AccordionDetails sx={{ padding: 0 }}>
            <BattingCard
              battingData={inningsOne.batting}
              isVictory={isInnings1Won && scoreCardData.isMatchComplete}
            />
            <BowlingCard bowlingData={inningsOne.bowling} />
          </AccordionDetails>
        </Accordion>
        <Accordion className='mt-5'>
          <AccordionSummary
            sx={{
              backgroundColor:
                !isInnings1Won && scoreCardData.isMatchComplete ? COLORS.cricPrimary : COLORS.white,
              color:
                !isInnings1Won && scoreCardData.isMatchComplete ? COLORS.white : COLORS.cricDark,
            }}
            expandIcon={
              <ExpandMoreIcon
                sx={{
                  color:
                    !isInnings1Won && scoreCardData.isMatchComplete
                      ? COLORS.white
                      : COLORS.cricDark,
                }}
              />
            }
            aria-controls='inningsTwo'
            id='inningsTwo'
          >
            <ScoreHeader
              isInnings2={true}
              teamName={inningsTwo.battingTeam}
              score={inningsTwo.score}
              status={scoreCardData.status}
              isMatchComplete={scoreCardData.isMatchComplete}
              isVictory={!isInnings1Won}
            />
          </AccordionSummary>
          <AccordionDetails sx={{ padding: 0 }}>
            <BattingCard battingData={inningsTwo.batting} isVictory={!isInnings1Won} />
            <BowlingCard bowlingData={inningsTwo.bowling} />
          </AccordionDetails>
        </Accordion>
      </div>
      <div className='flex flex-col'>
        <POMCard
          title={'Player of the Match'}
          isMatchComplete={scoreCardData.isMatchComplete}
          playerData={scoreCardData.playerOfTheMatch}
        />
        <POMCard
          title={'Jury Player of the Match'}
          isMatchComplete={scoreCardData.isMatchComplete}
          playerData={scoreCardData.peoplePlayerOfTheMatch}
        />
      </div>
    </div>
  )
}

export default ScoreCard
