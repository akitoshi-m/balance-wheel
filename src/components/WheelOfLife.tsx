import React, { ChangeEvent, useState } from "react";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import { Slider, TextField, Typography, Container, Grid, Button, Divider, List, ListItem, ListItemAvatar, ListItemText, Avatar } from "@mui/material";
import { AttachMoney, FamilyRestroom, HealthAndSafety, Home, People, School, SportsEsports, Work } from "@mui/icons-material";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const category = {
  Work: 0,
  Money: 1,
  Health: 2,
  Family: 3,
  Relationships: 4,
  Learning: 5,
  Leisure: 6,
  Environment: 7,
} as const;

type CategoryTypes = (typeof category)[keyof typeof category];

const categoryNames = (categoryType: CategoryTypes): string => {
  switch (categoryType) {
    case category.Work:
      return "仕事・キャリア";
    case category.Money:
      return "お金・経済";
    case category.Health:
      return "健康";
    case category.Family:
      return "家族・パートナー";
    case category.Relationships:
      return "人間関係";
    case category.Learning:
      return "学び・自己啓発";
    case category.Leisure:
      return "遊び・余暇";
    case category.Environment:
      return "物理的環境";
  }
};

const categoryIcons = (categoryType: CategoryTypes): JSX.Element => {
  switch (categoryType) {
    case category.Work:
      return <Work />;
    case category.Money:
      return <AttachMoney />;
    case category.Health:
      return <HealthAndSafety />;
    case category.Family:
      return <FamilyRestroom />;
    case category.Relationships:
      return <People />;
    case category.Learning:
      return <School />;
    case category.Leisure:
      return <SportsEsports />;
    case category.Environment:
      return <Home />;
  }
};

const initialValues = [5, 5, 5, 5, 5, 5, 5, 5];

const RadarChart: React.FC = () => {
  const [values, setValues] = useState<number[]>(initialValues);
  const [textFields, setTextFields] = useState<string[]>(Array(initialValues.length).fill(""));

  const data = {
    labels: Object.keys(category).map((key) => categoryNames(category[key as keyof typeof category])),
    datasets: [
      {
        label: "満足度",
        data: values,
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1
      }
    ]
  };

  const options = {
    scales: {
      r: {
        beginAtZero: true,
        max: 10
      }
    }
  };

  const currentDate = new Date();

  const handleSliderChange = (index: number, newValue: number) => {
    const newValues = [...values];
    newValues[index] = newValue;
    setValues(newValues);
  };

  const handleTextFieldChange = (index: number, event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newTextFields = [...textFields];
    newTextFields[index] = event.target.value;
    setTextFields(newTextFields);
  };

  return (
    <Container sx={{ width: '80%' }}>
      <Typography variant="h4" sx={{ p: 2, fontWeight: 'bold' }}>
        人生の輪 作成ツール
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Radar data={data} options={options} />
        </Grid>

        <Grid item xs={6}>
          <Typography variant="h6" sx={{ textAlign: 'start'}}>
            作成日: {currentDate.getFullYear()}年{currentDate.getMonth() + 1}月{currentDate.getDate()}日
          </Typography>
          <List>
            {Object.values(category).map((catType) => (
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar>
                    {categoryIcons(catType)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={categoryNames(catType)}
                  secondary={
                    <Typography
                      sx={{ display: 'inline' }}
                      component="span"
                      variant="overline"
                      color="text.primary"
                    >
                      {textFields[catType]}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>

      <Button variant="contained" sx={{ m: 2 }}>
        画像として保存する
      </Button>
      <Divider>
        <Typography variant="overline">
          以下、入力項目
        </Typography>
      </Divider>
      <Grid container spacing={2} alignItems="center">
        {Object.values(category).map((catType, index) => (
          <React.Fragment key={catType}>
            <Grid item xs={2}>
              <Typography variant="body1">
                <label>{categoryNames(catType)}</label>
              </Typography>
            </Grid>
            <Grid item xs={3} container alignItems="center">
              <Slider
                defaultValue={5}
                size="small"
                max={10}
                min={1}
                sx={{ width: '80%' }}
                value={values[catType]}
                onChange={(_e, newValue) => handleSliderChange(catType, newValue as number)}
              />
              <Typography variant="body1" sx={{ ml: 2 }}>
                {values[catType]}
              </Typography>
            </Grid>
            <Grid item xs={7}>
              <TextField
                fullWidth
                id={catType.toString()}
                placeholder={categoryNames(catType)}
                size="small"
                multiline
                value={textFields[catType]}
                onChange={(e) => handleTextFieldChange(catType, e)}
              />
            </Grid>
          </React.Fragment>
        ))}
      </Grid>
    </Container>
  );
}

export default RadarChart;
