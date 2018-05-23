import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Card } from 'antd'
import CountUp from 'react-countup'
import styles from './numberCard.less'

function NumberCard ({ icon, color, title, decimals, number, countUp }) {
  return (
    <Card className={styles.numberCard} bordered={false} bodyStyle={{ padding: 0 }}>
      <Icon className={styles.iconWarp} style={{ color }} type={icon} />
      <div className={styles.content}>
        <p className={styles.title}>{title || 'No Title'}<label className={styles.day} size="small" style={{ backgroundColor:color,color:'#FFFFFF' }}>昨日</label></p>
        <p className={styles.number}>
          <CountUp
            start={0}
            end={number}
            duration={2.75}
            decimals={decimals}
            useEasings
            useGrouping
            separator=","
            {...countUp || {}}
          />
        </p>
      </div>
    </Card>
  )
}

NumberCard.propTypes = {
  icon: PropTypes.string,
  color: PropTypes.string,
  title: PropTypes.string,
  number: PropTypes.number,
  decimals: PropTypes.number,
  countUp: PropTypes.object,
}

export default NumberCard
